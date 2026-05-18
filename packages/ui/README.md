# Clera UI

[![React](https://img.shields.io/badge/React-20232a?logo=react&logoColor=61dafb)](https://reactjs.org/) [![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://storybook.js.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![tested with jest](https://img.shields.io/badge/tested%20with-jest-99424f.svg?logo=jest)](https://jestjs.io/) [![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)

The official design system and shared React component library for the **Cleraview** platform.

This repository contains the core UI elements used across all Cleraview products. It is developed and documented in isolation using **Storybook**, built with **React (TypeScript)**, and styled with **Tailwind CSS**.

---

## Features

-   **React (TypeScript):** Fully-typed, reusable React components.
-   **Storybook:** Isolated component development, documentation, and testing.
-   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
-   **Testing (Jest & RTL):** Unit and integration testing for component logic.
-   **Testing (Playwright):** End-to-end and visual regression testing.
-   **CI/CD:** Automated testing (GitHub Actions) and deployment of Storybook to Vercel.

## Tech Stack

| Area | Stack |
| --- | --- |
| Core Framework | React (with Next.js for Storybook) |
| Component Dev | Storybook |
| Styling | Tailwind CSS |
| Unit Testing | Jest, React Testing Library |
| E2E Testing | Playwright |
| Linting | ESLint, Prettier |
| Deployment | Vercel (for Storybook) |

## Installation
```bash
npm install clera-ui
```

```bash
pnpm add clera-ui
```

```bash
yarn add clera-ui
```

## Usage
```tsx
import { Button } from "clera-ui/button"

const ButtonSelectedExample = () => {
  return <Button variant="outlinePrimary">Selected button</Button>
}

export default ButtonSelectedExample
```

## Development

#### 1. Clone & Install
```bash
git clone [https://github.com/Cleraview/Clera-UI.git](https://github.com/Cleraview/Clera-UI.git)
cd Clera-UI

# Install dependencies
pnpm install
```

#### 2. Run Dev Server
To browse and develop components in isolation, run the dev server:

```bash
pnpm run dev
```
Then visit `http://localhost:6006` in your browser.

## Testing
This repository uses a hybrid testing strategy:

#### 1. Jest (Unit & Integration Tests)
Run all unit tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm run test:watch
```

Generate a coverage report:
```bash
pnpm run test:coverage
```

#### 2. Playwright (E2E & Visual Tests)
#### Available Scripts

| Script | Command |
| --- | --- |
| `pnpm install` | Enforces `pnpm` as the only package manager. |
| `pnpm prepare` | Runs Husky to set up Git hooks. |
| `pnpm clean-install` | Removes `node_modules`, caches, and lockfile, then reinstalls. |
| `pnpm build` | Creates a static production build. |
| `pnpm dev` | Starts the dev server on port 6006 without opening a browser. |
| `pnpm doc:build` | Builds the project for Vercel production. |
| `pnpm doc:deploy` | Builds and deploys the project to Vercel production. |
| `pnpm lint` | Lints files in the `src` directory using ESLint/Next.js. |
| `pnpm lint:fix` | Automatically fixes linting errors in the `src` directory. |
| `pnpm test` | Runs all Jest unit tests. |
| `pnpm test:watch` | Runs Jest in watch mode, re-running tests on file changes. |
| `pnpm test:coverage` | Generates a test coverage report. |
| `pnpm type-check` | Checks the project for TypeScript type errors without compiling. |

## Deployment
The Storybook static site is configured to be automatically deployed to Vercel. Any commits or pull requests pushed to the repository will trigger a new build and deployment via GitHub Actions.