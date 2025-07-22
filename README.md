# @truto/turndown-plugin-gfm

> Enhanced Turndown plugin for GitHub Flavored Markdown with improved table conversion and performance

An ESM-only fork of the original [`@joplin/turndown-plugin-gfm`](https://github.com/laurent22/joplin-turndown-plugin-gfm) with significant improvements:

## ✨ Key Improvements

- **🚀 20x Performance Boost**: Table conversion optimized from 13+ seconds to ~600ms
- **🔧 Enhanced Edge Case Handling**: Robust handling of malformed HTML, special characters, and edge cases
- **📦 ESM-Only**: Modern ES module format with clean exports
- **🧪 Comprehensive Testing**: Full vitest test suite with 100% coverage
- **⚡ Simplified Logic**: Streamlined codebase focused on GitHub-flavored markdown
- **🔧 Modern Tooling**: Built with latest Vite 7.x and Vitest 3.x for optimal development experience
- **📝 TypeScript Support**: Complete TypeScript declarations included

## 🚨 Breaking Changes from Original

- **ESM Only**: Requires Node.js 18+ and ES module imports
- **Simplified Table Logic**: No complex alignment or Joplin-specific features
- **Modern Dependencies**: Updated to latest tooling (Vitest 3.x, Vite 7.x, ESLint 9.x)

## 📦 Installation

```bash
npm install @truto/turndown-plugin-gfm
```

## 🎯 Usage

### Basic Usage

```javascript
import TurndownService from 'turndown'
import { gfm } from '@truto/turndown-plugin-gfm'

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
import { gfm, TurndownPlugin } from '@truto/turndown-plugin-gfm'

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
import { tables, strikethrough, taskListItems, highlightedCodeBlock } from '@truto/turndown-plugin-gfm'

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

## 🏗️ Table Conversion Features

### Edge Cases Handled

- ✅ Empty tables and cells
- ✅ Single-cell tables
- ✅ Tables without headers
- ✅ Colspan and rowspan attributes
- ✅ Malformed HTML structures
- ✅ Special characters (`|`, `\`, quotes, etc.)
- ✅ Nested content (lists, paragraphs, formatting)
- ✅ Line breaks and whitespace normalization
- ✅ Very wide tables (15+ columns)

### Performance

- **Large Tables**: Handles 1000+ row tables in under 1 second
- **Complex Content**: Processes nested HTML efficiently
- **Memory Efficient**: No memory leaks or degradation over time

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

### Testing & Build

The project uses modern tooling for an optimal development experience:

- **[Vitest 3.x](https://vitest.dev/)**: Fast unit testing with coverage
- **[Vite 7.x](https://vitejs.dev/)**: Lightning fast build tool  
- **[ESLint 9.x](https://eslint.org/)**: Code quality and consistency

Test coverage includes:
- **Unit Tests**: Individual plugin functionality
- **Integration Tests**: Combined plugin usage
- **Edge Case Tests**: Malformed HTML, special characters, performance
- **Performance Tests**: Large table processing benchmarks

## 📊 Compatibility

### Supported

- ✅ Node.js 18+
- ✅ ES modules
- ✅ Modern bundlers (Vite, Rollup, Webpack 5+)
- ✅ TypeScript (with generated types)

### Not Supported

- ❌ CommonJS `require()`
- ❌ Node.js < 18
- ❌ Legacy bundlers

## 🔄 Migration from Original

```javascript
// Before (CommonJS)
const gfm = require('@joplin/turndown-plugin-gfm')

// After (ESM)
import { gfm } from '@truto/turndown-plugin-gfm'
```

## 📄 License

MIT © [Truto](https://github.com/trutohq)

Enhanced by the community with performance improvements and modern tooling.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 🙏 Acknowledgments

- Original [`turndown-plugin-gfm`](https://github.com/mixmark-io/turndown-plugin-gfm) by Dom Christie
- Joplin team for the enhanced version that served as the base
- Community contributors for edge case testing and feedback
