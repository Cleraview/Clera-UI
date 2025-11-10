import remarkGfm from 'remark-gfm'
import path from 'path'

const config = {
  stories: [
    "../@(src|docs)/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
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
    "../public",
    {
      from: "../src/assets/docs", to: "/assets"
    }
  ],
  webpackFinal: async (config) => {
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
 
    const imageRule = config.module.rules.find((rule) =>
      typeof rule === 'object' && rule.test instanceof RegExp && rule.test.test('.svg')
    )

    if (imageRule) {
      imageRule.exclude = /\.svg$/
    }

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(path.resolve(), '../src/'),
      };
    }
    
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    config.plugins = config.plugins || [];
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