import autoprefixer from "autoprefixer";
import tailwindcss from '@tailwindcss/postcss'

let plugins = []
const eventName = process.env.npm_lifecycle_event

if (
  ['dev', 'build'].includes(eventName) ||
  eventName.startsWith('bundle')
) {
  plugins.push(tailwindcss(), autoprefixer())
} else {
  plugins.push("@tailwindcss/postcss")
}

const config = {
  plugins
};

export default config;
