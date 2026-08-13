## Project

- This is an ES module library that adds GitHub Flavored Markdown support to Turndown.
- Source files are in `src/`; Vitest tests and HTML fixtures are in `test/`.
- Keep public exports in `src/index.js` and declarations in `src/index.d.ts` synchronized.
- Do not edit generated files in `lib/`.

## Development Commands

- `npm run test:run` — Run the test suite once.
- `npm run lint` — Lint source and test files.
- `npm run build` — Build the library into `lib/`.
- `npm test` — Run Vitest in watch mode during development.

## Coding and Testing

- Match the existing JavaScript style and use ES modules.
- Add or update regression tests for behavior changes.
- For table conversion cases, reuse or add HTML fixtures under `test/` when helpful.
- Before finishing, run `npm run test:run`, `npm run lint`, and `npm run build`.

## Git

- Use conventional commit messages.
- Do not create commits unless explicitly requested.