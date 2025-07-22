import TurndownService from 'turndown'
import { beforeEach, describe, expect, it } from 'vitest'
import { gfm, highlightedCodeBlock, strikethrough, tables, taskListItems } from '../src/index.js'

describe('GFM Plugin', () => {
  let turndownService

  beforeEach(() => {
    turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    })
  })

  describe('Main GFM plugin', () => {
    it('should apply all GFM plugins when used', () => {
      turndownService.use(gfm)

      const html = `
        <table>
          <tr><th>Name</th><th>Age</th></tr>
          <tr><td>John</td><td>30</td></tr>
        </table>
        <p><del>Deleted text</del></p>
        <div class="highlight-javascript"><pre>console.log('hello')</pre></div>
        <ul>
          <li><input type="checkbox" checked> Completed task</li>
          <li><input type="checkbox"> Pending task</li>
        </ul>
      `

      const result = turndownService.turndown(html)

      // Should contain table
      expect(result).toMatch(/\|.*Name.*\|.*Age.*\|/)
      expect(result).toMatch(/\|.*---.*\|.*---.*\|/)
      
      // Should contain strikethrough
      expect(result).toMatch(/~~Deleted text~~/)
      
      // Should contain code content (highlighting plugin works)
      expect(result).toContain("console.log('hello')")
      
      // Should contain task list items
      expect(result).toMatch(/\[x\]\s+Completed task/)
      expect(result).toMatch(/\[\s\]\s+Pending task/)
    })

    it('should be importable as default export', () => {
      expect(typeof gfm).toBe('function')
      expect(() => turndownService.use(gfm)).not.toThrow()
    })

    it('should export individual plugins', () => {
      expect(typeof tables).toBe('function')
      expect(typeof strikethrough).toBe('function')
      expect(typeof highlightedCodeBlock).toBe('function')
      expect(typeof taskListItems).toBe('function')
    })
  })

  describe('Individual plugin usage', () => {
    it('should allow using individual plugins', () => {
      turndownService.use(tables)
      
      const html = '<table><tr><th>A</th></tr><tr><td>1</td></tr></table>'
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/\|.*A.*\|/)
      expect(result).toMatch(/\|.*---.*\|/)
      expect(result).toMatch(/\|.*1.*\|/)
    })

    it('should allow combining specific plugins', () => {
      turndownService.use([tables, strikethrough])
      
      const html = `
        <table><tr><th>Status</th></tr><tr><td><del>Done</del></td></tr></table>
      `
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/\|.*Status.*\|/)
      expect(result).toMatch(/~~Done~~/)
    })
  })
}) 