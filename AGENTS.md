# Repository Guidelines

## Project Structure & Module Organization
Source code lives in `src/`: feature screens under `components/` (root for flows, `components/ui/` for primitives), datasets in `data/`, copy in `guidelines/`, global styles in `styles/`, shared contracts in `types/`, and helpers in `utils/` (including the mock AI simulators). Vite writes builds to `build/`; keep it untracked. Root files such as `package.json`, `vite.config.ts`, and `index.html` define tooling and entry markup—change them in tandem with dependency or layout updates.

## Build, Test, and Development Commands
Install dependencies with `npm install`. Use `npm run dev` to launch the Vite dev server (http://localhost:5173 by default) and verify flows. Ship production bundles through `npm run build`, which runs TypeScript checks and outputs assets to `build/`. There is no automated test script yet; when you introduce one, expose it through an npm command (for example, `npm test`) so local and CI usage stay aligned.

## Coding Style & Naming Conventions
Implement features as TypeScript React function components exported with PascalCase filenames. Match the current two-space indentation, single quotes, and trailing commas; if you add a formatter such as Prettier or Biome, commit its config. Reuse definitions from `src/types/models.ts` instead of recreating interfaces, and favor descriptive prop and state names. Extend styling via `src/styles/globals.css` or scoped classNames that honor the existing token palette.

## Testing Guidelines
Add coverage alongside new functionality. Favor component-level tests (Vitest with React Testing Library works well with Vite) stored next to the feature (`FeatureName.test.tsx`) or under `src/__tests__` for shared utilities. Name specs with `.test.ts(x)` so tooling discovers them automatically. Until the automated suite exists, document manual verification steps in PRs and exercise key API workflows through `npm run dev`.

## Commit & Pull Request Guidelines
Write commit subjects in the imperative mood (`Add dashboard toolbar`) and keep them concise; include breaking-change or migration notes in the body if needed. Pull requests should supply a short summary, linked tasks, UI screenshots or GIFs when applicable, and a checklist of manual or automated tests run. Call out configuration updates (env variables, scripts, data files) so reviewers can reproduce them quickly.

## Design & Data Alignment
Keep implementation synced with the Figma source referenced in `README.md`. Update `src/data/sampleData.ts` when scenarios evolve, and mark placeholder credentials clearly. Never commit real secrets—load them through `.env.local` and describe any required keys in the PR.
