import { fileURLToPath } from 'url'
import remarkGfm from 'remark-gfm'
import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import type { Configuration as WebpackConfiguration } from 'webpack'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WORKSPACE_ROOT = path.resolve(__dirname, '../../..')
const fromRoot = (...parts: string[]) => path.join(WORKSPACE_ROOT, ...parts)

// Resolves `@/` per-package: walk up from the importing file to the nearest
// package (a dir with both package.json and src/) and point `@` at its src.
// This mirrors how tsconfig paths and jest resolve `@/` inside each package.
const findPackageSrc = (dir?: string): string | null => {
  let current = dir
  while (current && current !== path.dirname(current)) {
    if (
      fs.existsSync(path.join(current, 'package.json')) &&
      fs.existsSync(path.join(current, 'src'))
    ) {
      return path.join(current, 'src')
    }
    current = path.dirname(current)
  }
  return null
}

type StorybookConfig = Record<string, any>
const config: StorybookConfig = {
  stories: [
    fromRoot('packages/*/src/**/*.mdx'),
    fromRoot('packages/*/src/**/*.stories.@(js|jsx|mjs|ts|tsx)')
  ],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "storybook-addon-deep-controls",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm]
          }
        }
      }
    }
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {}
  },
  staticDirs: [
    fromRoot('packages/ui/public'),
    {
      from: fromRoot('packages/ui/src/assets/docs'), to: "/assets"
    }
  ],
  webpackFinal: async (config: WebpackConfiguration) => {
    config.module = config.module || {}
    config.module.rules = (config.module.rules || []) as any[]

    const imageRule = config.module.rules.find((rule: any) =>
      !!rule && typeof rule === 'object' && rule.test instanceof RegExp && rule.test.test('.svg')
    )

    if (imageRule) {
      ;(imageRule as any).exclude = /\.svg$/
    }

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@ui': fromRoot('packages/ui/src'),
      };
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^@\//, resource => {
        const src = findPackageSrc(resource.context)
        if (src) {
          resource.request = path.join(src, resource.request.slice(2))
        }
      })
    )
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.done.tap('MyCustomSignalPlugin', (stats) => {
          if (!stats.hasErrors()) {
            console.log('STORYBOOK_SERVER_READY_SIGNAL');
          }
        });
      },
    })

    return config
  }
}
export default config
