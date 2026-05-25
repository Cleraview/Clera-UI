# Clera

Monorepo for the Clera design system: UI components, design tokens, and charts, plus a Storybook that documents them.

## Packages

| Package | Location | What it is |
| --- | --- | --- |
| `@clera/ui` | `packages/ui` | React component library — Button, Toast, Alert, form controls, and so on |
| `@clera/tokens` | `packages/tokens` | Design tokens. Source JSON in `tokens/`, generated CSS in `dist/` |
| `@clera/charts` | `packages/charts` | Data-visualization primitives, built on top of `@clera/ui` and the tokens |
| `@clera/config-jest` | `packages/configs/jest` | Shared Jest base config the other packages extend |
| `@clera/storybook` | `apps/storybook` | Storybook site; picks up stories from every package |

Cross-package dependencies use the `workspace:*` protocol. `@clera/ui` and `@clera/charts` both pull their styling from `@clera/tokens`.

## Requirements

- Node 22 or newer
- pnpm 10 - run `corepack enable` and it'll use the version pinned in `package.json`

The repo is pnpm-only; `npm install` and `yarn` are blocked.

## Setup

```sh
pnpm install
```

`@clera/tokens` keeps its generated CSS committed under `dist/`, so there's nothing to build before Storybook or the tests will run.

## Day-to-day

Tasks run through Turborepo from the root — across every package, with caching.

```sh
pnpm lint          # eslint
pnpm test          # jest
pnpm type-check    # tsc --noEmit
pnpm build         # packages that define a build task
```

Storybook:

```sh
pnpm --filter @clera/storybook dev
```

Use `--filter` to scope anything to one package:

```sh
pnpm --filter @clera/charts test
```

## Editing tokens

Token sources are `packages/tokens/tokens/*.json`. After changing them, regenerate the CSS and commit the result alongside the JSON:

```sh
pnpm --filter @clera/tokens build
```

The output in `packages/tokens/dist` is checked in on purpose, so consumers don't need to run the generator.

## Releasing

Versioning goes through Changesets:

```sh
pnpm changeset          # write a changeset for your change
pnpm changeset:version  # apply the bumps and update changelogs
```

Publishing happens from CI once the version PR lands on `main`.

## Conventions

- Commits follow Conventional Commits — commitlint checks the message on commit.
- Pre-commit runs lint-staged: type-check and tests for touched package sources, eslint for touched files.

## License

MIT — see [LICENSE](./LICENSE).
