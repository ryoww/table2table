# Repository Guidelines

## Project Structure & Module Organization
`src/` houses Chakra-based React modules: `components/` for UI (TableEditor, Toolbar, LatexPreview, CopyButton), `utils/latexConverter.ts` for Luckysheet→LaTeX, `hooks/` for shared state (e.g., Zustand stores), and `theme.ts` for design tokens. Entry points live in `main.tsx` and `App.tsx`. Keep static assets in `public/`. Add UI-level tests under `src/__tests__/` mirroring the component tree, and document shared configs in `config/config.ts` (or create it) so runtime knobs stay centralized.

## Build, Test, and Development Commands
`npm install` boots the toolchain. `npm run dev` launches Vite with hot reload. `npm run build` performs the production bundle and TypeScript emit. `npm run preview` serves the dist bundle for smoke checks. When lint scripts are added, prefer `npm run lint` before committing.

## Coding Style & Naming Conventions
Stick to TypeScript strict mode, 2-space indentation, and Chakra’s compositional patterns (no inline magic numbers—lift them into config). Every file starts with a short header comment (what/why) per repo charter. Component files use PascalCase (`TableEditor.tsx`), hooks use the `useFoo.ts` pattern, utilities stay in camelCase. Run Prettier + ESLint (standard React + @typescript-eslint rules); avoid adding dependencies unless justified.

## Testing Guidelines
Use Vitest + React Testing Library (`npm run test`) for unit/UI coverage; favor table-driven cases to reflect spreadsheet permutations. Name specs `<Component>.test.tsx` and cover merged-cell LaTeX branches before shipping. Add regression tests whenever touching conversion logic or clipboard helpers.

## Commit & Pull Request Guidelines
History currently only shows `Initial commit`, so enforce forward-looking Conventional Commits (`feat: add latex converter`). Each PR should include: concise summary, linked issue, screenshots/GIFs for UI, list of test commands run, and any new config toggles. Keep diffs reversible and under 300 LOC per file; if unsure about scope, pause and ask before merging.

## Agent Workflow & Documentation
Follow the Plan→Read→Verify→Implement→Test/Docs→Reflect cadence documented in `README.md`. Before coding, query context7 for API docs, validate Luckysheet/Chakra usage, and document assumptions inline. Favor small, safe steps and escalate uncertainties immediately.
