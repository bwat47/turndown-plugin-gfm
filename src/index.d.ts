/**
 * TurndownService interface for type safety
 */
interface TurndownService {
  use(plugin: TurndownPlugin | TurndownPlugin[]): TurndownService;
  turndown(html: string): string;
  addRule(key: string, rule: any): TurndownService;
  [key: string]: any;
}

/**
 * Plugin function type for Turndown service
 */
export type TurndownPlugin = (turndownService: TurndownService) => void;

/**
 * Tables plugin - Converts HTML tables to GitHub Flavored Markdown tables
 * 
 * Features:
 * - Handles standard table structures
 * - Supports colspan attributes
 * - Escapes pipe characters and special characters
 * - Gracefully handles malformed HTML
 * - Performance optimized for large tables
 */
export declare const tables: TurndownPlugin;

/**
 * Strikethrough plugin - Converts <del>, <s>, and <strike> tags to ~~text~~
 */
export declare const strikethrough: TurndownPlugin;

/**
 * Task list items plugin - Converts checkbox inputs to [x] and [ ] syntax
 */
export declare const taskListItems: TurndownPlugin;

/**
 * Highlighted code block plugin - Converts highlighted code blocks to fenced code blocks
 * 
 * Supports various highlight class formats:
 * - highlight-{language}
 * - highlight-text-{language}
 * - highlight-source-{language}
 */
export declare const highlightedCodeBlock: TurndownPlugin;

/**
 * GitHub Flavored Markdown plugin - Combines all GFM plugins
 * 
 * Includes: tables, strikethrough, taskListItems, and highlightedCodeBlock
 * 
 * @param turndownService - The Turndown service instance to configure
 * 
 * @example
 * ```typescript
 * import TurndownService from 'turndown';
 * import { gfm } from '@truto/turndown-plugin-gfm';
 * 
 * const turndownService = new TurndownService();
 * turndownService.use(gfm);
 * 
 * const markdown = turndownService.turndown('<table>...</table>');
 * ```
 */
export declare const gfm: TurndownPlugin;

/**
 * Default export - same as gfm
 */
declare const _default: TurndownPlugin;
export default _default; 