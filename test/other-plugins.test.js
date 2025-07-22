import TurndownService from 'turndown'
import { beforeEach, describe, expect, it } from 'vitest'
import { highlightedCodeBlock, strikethrough, taskListItems } from '../src/index.js'

describe('Other GFM Plugins', () => {
  let turndownService

  beforeEach(() => {
    turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    })
  })

  describe('Strikethrough Plugin', () => {
    beforeEach(() => {
      turndownService.use(strikethrough)
    })

    it('should convert <del> tags to strikethrough', () => {
      const html = '<p>This is <del>deleted</del> text.</p>'
      const result = turndownService.turndown(html)
      
      expect(result).toContain('~~deleted~~')
      expect(result).toMatch(/This is ~~deleted~~ text\./)
    })

    it('should convert <s> tags to strikethrough', () => {
      const html = '<p>This is <s>struck through</s> text.</p>'
      const result = turndownService.turndown(html)
      
      expect(result).toContain('~~struck through~~')
    })

    it('should convert <strike> tags to strikethrough', () => {
      const html = '<p>This is <strike>struck</strike> text.</p>'
      const result = turndownService.turndown(html)
      
      expect(result).toContain('~~struck~~')
    })

    it('should handle nested content in strikethrough', () => {
      const html = '<del><strong>Bold</strong> and <em>italic</em></del>'
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/~~\*\*Bold\*\* and _italic_~~/)
    })

    it('should handle empty strikethrough tags', () => {
      const html = '<p>Text with <del></del> empty strikethrough.</p>'
      const result = turndownService.turndown(html)
      
      // Empty del tags are removed completely, which is correct behavior
      expect(result.trim()).toBe('Text with empty strikethrough.')
    })
  })

  describe('Highlighted Code Block Plugin', () => {
    beforeEach(() => {
      turndownService.use(highlightedCodeBlock)
    })

    it('should convert highlighted JavaScript code blocks', () => {
      const html = `
        <div class="highlight-javascript">
          <pre>console.log('Hello, world!');</pre>
        </div>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/```javascript[\s\S]*console\.log\('Hello, world!'\);[\s\S]*```/)
    })

    it('should convert highlighted Python code blocks', () => {
      const html = `
        <div class="highlight-python">
          <pre>print("Hello, world!")</pre>
        </div>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/```python[\s\S]*print\("Hello, world!"\)[\s\S]*```/)
    })

    it('should handle highlight-source- prefix', () => {
      const html = `
        <div class="highlight-source-ruby">
          <pre>puts "Hello, world!"</pre>
        </div>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/```ruby[\s\S]*puts "Hello, world!"[\s\S]*```/)
    })

    it('should handle highlight-text- prefix', () => {
      const html = `
        <div class="highlight-text-shell">
          <pre>echo "Hello, world!"</pre>
        </div>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/```shell[\s\S]*echo "Hello, world!"[\s\S]*```/)
    })

    it('should handle code blocks without language', () => {
      const html = `
        <div class="highlight">
          <pre>some code here</pre>
        </div>
      `
      
      const result = turndownService.turndown(html)
      
      // Should not be converted by this plugin if no language is detected
      expect(result).not.toMatch(/```[\s\S]*some code here[\s\S]*```/)
    })

    it('should preserve whitespace and formatting in code blocks', () => {
      const html = `
        <div class="highlight-javascript">
          <pre>function example() {
  const x = 1;
  return x + 2;
}</pre>
        </div>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toContain('function example() {\n  const x = 1;\n  return x + 2;\n}')
    })

    it('should not convert divs without pre children', () => {
      const html = '<div class="highlight-javascript">Not a code block</div>'
      const result = turndownService.turndown(html)
      
      expect(result).not.toMatch(/```/)
      expect(result).toContain('Not a code block')
    })
  })

  describe('Task List Items Plugin', () => {
    beforeEach(() => {
      turndownService.use(taskListItems)
    })

    it('should convert checked checkboxes to [x]', () => {
      const html = `
        <ul>
          <li><input type="checkbox" checked> Completed task</li>
        </ul>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/\[x\]\s+Completed task/)
    })

    it('should convert unchecked checkboxes to [ ]', () => {
      const html = `
        <ul>
          <li><input type="checkbox"> Pending task</li>
        </ul>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/\[\s\]\s+Pending task/)
    })

    it('should handle mixed checked and unchecked tasks', () => {
      const html = `
        <ul>
          <li><input type="checkbox" checked> Done</li>
          <li><input type="checkbox"> Todo</li>
          <li><input type="checkbox" checked> Also done</li>
        </ul>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/\[x\]\s+Done/)
      expect(result).toMatch(/\[\s\]\s+Todo/)
      expect(result).toMatch(/\[x\]\s+Also done/)
    })

    it('should only convert checkboxes inside list items', () => {
      const html = `
        <p><input type="checkbox" checked> Not in a list</p>
        <ul>
          <li><input type="checkbox" checked> In a list</li>
        </ul>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/\[x\]\s+In a list/)
      expect(result).not.toMatch(/Not in a list.*\[x\]/)
    })

    it('should handle tasks with complex content', () => {
      const html = `
        <ul>
          <li><input type="checkbox" checked> <strong>Important</strong> task with <em>formatting</em></li>
          <li><input type="checkbox"> Task with <a href="http://example.com">link</a></li>
        </ul>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/\[x\]\s+\*\*Important\*\* task with _formatting_/)
      expect(result).toMatch(/\[\s\]\s+Task with \[link\]\(http:\/\/example\.com\)/)
    })

    it('should handle nested lists with tasks', () => {
      const html = `
        <ul>
          <li><input type="checkbox" checked> Parent task
            <ul>
              <li><input type="checkbox"> Subtask 1</li>
              <li><input type="checkbox" checked> Subtask 2</li>
            </ul>
          </li>
        </ul>
      `
      
      const result = turndownService.turndown(html)
      
      expect(result).toMatch(/\[x\]\s+Parent task/)
      expect(result).toMatch(/\[\s\]\s+Subtask 1/)
      expect(result).toMatch(/\[x\]\s+Subtask 2/)
    })
  })
}) 