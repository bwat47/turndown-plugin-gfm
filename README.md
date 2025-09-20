# turndown-plugin-gfm

> Enhanced Turndown plugin for GitHub Flavored Markdown with improved table conversion and performance

## Fork information

This is a fork of @truto/turndown-plugin-gfm with some minor changes:

- Fixed table conversion issue related to header separator detection.
- Updated eslint config and fixed lint errors.

## 📦 Installation

```bash
npm install @bwat47/turndown-plugin-gfm
```

## 🎯 Usage

### Basic Usage

```javascript
import TurndownService from 'turndown'
import { gfm } from '@bwat47/turndown-plugin-gfm'

const turndownService = new TurndownService()
turndownService.use(gfm)

const markdown = turndownService.turndown('<table><tr><th>Name</th></tr><tr><td>John</td></tr></table>')
console.log(markdown)
// | Name |
// | --- |
// | John |
```

### TypeScript Usage

```typescript
import TurndownService from 'turndown'
import { gfm, TurndownPlugin } from '@bwat47/turndown-plugin-gfm'

const turndownService = new TurndownService()
turndownService.use(gfm)

// Type-safe plugin usage
const customPlugin: TurndownPlugin = (turndownService) => {
  // Your custom plugin logic
}

turndownService.use([gfm, customPlugin])
```

### Individual Plugins

```javascript
import TurndownService from 'turndown'
import { tables, strikethrough, taskListItems, highlightedCodeBlock } from '@bwat47/turndown-plugin-gfm'

const turndownService = new TurndownService()

// Use only specific plugins
turndownService.use([tables, strikethrough])

// Or use them individually
turndownService.use(tables)
turndownService.use(taskListItems)
```

### Available Plugins

- **`tables`**: Convert HTML tables to GitHub-flavored markdown tables
- **`strikethrough`**: Convert `<del>`, `<s>`, `<strike>` to `~~text~~`
- **`taskListItems`**: Convert checkbox inputs to `[x]` and `[ ]`
- **`highlightedCodeBlock`**: Convert highlighted code blocks to fenced code blocks
- **`gfm`**: All plugins combined

## 🧪 Development

### Requirements

- Node.js 18+
- ES modules support

### Scripts

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build the library
npm run build

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```