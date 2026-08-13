const rules = {}

// Escape pipe characters that are not already escaped while preserving existing Markdown escapes.
function escapeUnescapedPipes(value) {
  let result = ''
  let backslashRunLength = 0

  for (let i = 0; i < value.length; i++) {
    const char = value[i]

    if (char === '\\') {
      result += char
      backslashRunLength += 1
      continue
    }

    if (char === '|') {
      // Even number of backslashes (including 0) means the pipe is not escaped
      if (backslashRunLength % 2 === 0) {
        result += '\\|'
      } else {
        result += char
      }
    } else {
      result += char
    }

    backslashRunLength = 0
  }

  return result
}

// Helper function to safely get text content and clean it
function cleanCellContent(content) {
  if (!content) return '   ' // Default empty cell content
  
  // Clean and normalize content. Newlines here only come from block elements
  // (paragraphs, lists, ...) — BR elements are handled by the tableCellBr rule.
  let cleaned = content
    .trim()
    .replace(/\r\n?/g, '\n') // Normalize carriage returns to newlines
    .replace(/[ \t]+/g, ' ') // Collapse spaces/tabs
    .replace(/ ?\n ?/g, '<br>') // Convert newlines to <br> so cells stay on one line

  cleaned = escapeUnescapedPipes(cleaned)
  
  // If content is still empty or only whitespace, provide default
  if (!cleaned || cleaned.match(/^\s*$/)) {
    return '   '
  }
  
  // Ensure minimum width for table readability
  if (cleaned.length < 3) {
    cleaned += ' '.repeat(3 - cleaned.length)
  }
  
  return cleaned
}

// Enhanced cell replacement with colspan support
function cell(content, node, index) {
  if (index === null && node && node.parentNode) {
    index = Array.prototype.indexOf.call(node.parentNode.childNodes, node)
  }
  if (index === null) index = 0
  
  let prefix = ' '
  if (index === 0) prefix = '| '
  
  const cellContent = cleanCellContent(content)
  
  // Handle colspan by adding extra empty cells
  let colspan = 1
  if (node && node.getAttribute) {
    colspan = parseInt(node.getAttribute('colspan') || '1', 10)
    if (isNaN(colspan) || colspan < 1) colspan = 1
  }
  
  let result = prefix + cellContent + ' |'
  
  // Add empty cells for colspan
  for (let i = 1; i < colspan; i++) {
    result += '   |'
  }
  
  return result
}

// Check if a line is a valid GFM table separator row
function isSeparatorRow(line) {
  // Trim and require it to start and end with a pipe
  const s = (line || '').trim()
  if (!s.startsWith('|') || !s.endsWith('|')) return false

  // Each cell must be only dashes, optionally wrapped with colons, with optional spaces
  // e.g., '---', ':---', '---:', ':---:' (minimum 3 dashes per GFM)
  const cells = s.split('|').slice(1, -1) // inner cells
  if (cells.length === 0) return false

  return cells.every(c => /^ *:?-{3,}:? *$/.test(c))
}

// Check if this is a heading row (enhanced for edge cases)
function isHeadingRow(tr) {
  if (!tr || !tr.parentNode) return false
  
  const parentNode = tr.parentNode
  
  // Check if parent is THEAD
  if (parentNode.nodeName === 'THEAD') return true
  
  // Check if it's the first row and contains TH elements
  if (parentNode.firstChild === tr && 
      (parentNode.nodeName === 'TABLE' || parentNode.nodeName === 'TBODY')) {
    
    // Check if all child nodes are TH (ignore text nodes)
    const cellNodes = Array.prototype.filter.call(tr.childNodes, function(n) {
      return n.nodeType === 1 // Element nodes only
    })
    
    if (cellNodes.length === 0) return false
    
    return Array.prototype.every.call(cellNodes, function (n) {
      return n.nodeName === 'TH'
    })
  }
  
  return false
}

// Gather per-table facts in a single traversal.
// Both cell counts are kept because the checks below rely on different
// semantics: a lone empty <td colspan="2"> must be skipped (one cell element)
// but is not a single-cell table (two spanned cells).
function getTableStats(table) {
  const stats = {
    cellElements: 0, // raw TD/TH element count (colspan ignored)
    spannedCells: 0, // colspan-adjusted cell count
    contentCells: 0, // cells with non-whitespace text content
    rowsWithCells: 0, // rows containing at least one TD/TH
    maxCols: 0 // widest row, colspan-adjusted
  }

  if (!table || !table.rows) return stats

  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i]
    if (!row || !row.childNodes) continue

    let spannedInRow = 0

    for (let j = 0; j < row.childNodes.length; j++) {
      const cell = row.childNodes[j]
      if (cell.nodeType === 1 && (cell.nodeName === 'TD' || cell.nodeName === 'TH')) {
        const colspan = parseInt(cell.getAttribute('colspan') || '1', 10)
        stats.cellElements++
        spannedInRow += isNaN(colspan) ? 1 : Math.max(1, colspan)
        if (cell.textContent && cell.textContent.trim()) {
          stats.contentCells++
        }
      }
    }

    if (spannedInRow > 0) {
      stats.rowsWithCells++
      stats.spannedCells += spannedInRow
    }
    if (spannedInRow > stats.maxCols) stats.maxCols = spannedInRow
  }

  return stats
}

// Check if table is a single-cell table (1 row, 1 cell)
function isSingleCellTable(stats) {
  return stats.rowsWithCells === 1 && stats.spannedCells === 1
}

// Check if table should be skipped (too simple or malformed):
// no cells at all, or a single cell with no meaningful content
function shouldSkipTable(stats) {
  if (stats.cellElements === 0) return true
  if (stats.cellElements === 1 && stats.contentCells === 0) return true
  return false
}

// Line breaks inside cells: emit <br> directly from the BR node (overriding
// Turndown's built-in br rule) so the output is independent of the configured
// `br` option and can't collide with literal text resembling a break marker.
rules.tableCellBr = {
  filter: function (node) {
    return node.nodeName === 'BR' && node.closest('td, th') !== null
  },
  replacement: function () {
    return '<br>'
  }
}

rules.tableCell = {
  filter: ['th', 'td'],
  replacement: function (content, node) {
    return cell(content, node, null)
  }
}

rules.tableRow = {
  filter: 'tr',
  replacement: function (content, node) {
    // Skip empty rows
    if (!content || !content.trim()) return ''
    
    let borderCells = ''
    
    // Add separator row for heading
    if (isHeadingRow(node)) {
      const table = node.closest('table')
      if (table) {
        const colCount = getTableStats(table).maxCols

        if (colCount > 0) {
          for (let i = 0; i < colCount; i++) {
            const prefix = i === 0 ? '| ' : ' '
            borderCells += prefix + '---' + ' |'
          }
        }
      }
    }
    
    return '\n' + content + (borderCells ? '\n' + borderCells : '')
  }
}

rules.table = {
  filter: 'table',
  replacement: function (content, node) {
    const stats = getTableStats(node)

    // Single-cell table (1 row, 1 cell): return just the text content
    // without table formatting
    if (isSingleCellTable(stats)) {
      const textContent = node.textContent || ''
      return textContent.trim() ? '\n\n' + textContent.trim() + '\n\n' : ''
    }

    if (shouldSkipTable(stats)) {
      return ''
    }
    
    // Clean up content (remove extra newlines)
    content = content.replace(/\n+/g, '\n').trim()
    
    // If no content after cleaning, return empty
    if (!content) return ''
    
    // Split into lines and filter out empty lines
    const lines = content.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) return ''
    
    // Check if we need to add a header row
    const hasHeaderSeparator = lines.length >= 2 && isSeparatorRow(lines[1])
    
    let result = lines.join('\n')
    
    // If no header separator exists, add a simple one
    if (!hasHeaderSeparator && lines.length >= 1) {
      const firstLine = lines[0]
      const colCount = (firstLine.match(/\|/g) || []).length - 1
      
      if (colCount > 0) {
        let separator = '|'
        for (let i = 0; i < colCount; i++) {
          separator += ' --- |'
        }
        
        // Insert separator after first line
        const resultLines = [lines[0], separator, ...lines.slice(1)]
        result = resultLines.join('\n')
      }
    }
    
    return '\n\n' + result + '\n\n'
  }
}

// Remove table sections but keep content
rules.tableSection = {
  filter: ['thead', 'tbody', 'tfoot'],
  replacement: function (content) {
    return content
  }
}

// Remove captions and colgroups
rules.tableCaption = {
  filter: ['caption'],
  replacement: function() { return '' }
}

rules.tableColgroup = {
  filter: ['colgroup', 'col'],
  replacement: function() { return '' }
}

export default function tables(turndownService) {
  for (const key of Object.keys(rules)) {
    turndownService.addRule(key, rules[key])
  }
}
