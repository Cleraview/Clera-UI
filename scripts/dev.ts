import { execa } from 'execa'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import path from 'path'
import chokidar from 'chokidar'

function getPackageJson() {
  const pkgPath = path.resolve(process.cwd(), 'package.json')
  const pkgJson = readFileSync(pkgPath, 'utf8')
  return JSON.parse(pkgJson)
}

function getPort(devScript: string): string {
  const portMatch = devScript.match(/-p\s+(\d+)/)
  if (portMatch && portMatch[1]) {
    return portMatch[1]
  }
  return '6006'
}

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
) {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

let headerPrinted = false

const printHeader = (port: string, version: string) => {
  if (headerPrinted) return
  headerPrinted = true
  console.clear()

  const title = chalk.cyanBright.bold('Clera UI')
  const ver = chalk.cyan(`v${version}`)

  console.log(`\n  ${title} ${ver}\n`)
  console.log(
    `  ${chalk.inverse(chalk.bold.green(' LOCAL '))}  ${chalk.bold(
      'URL:',
    )}     ${chalk.green.underline(`http://localhost:${port}`)}`,
  )
  console.log(
    `  ${chalk.inverse(chalk.bold.cyan(' STATUS '))} ${chalk.bold(
      'Mode:',
    )}    ${chalk.cyan('development')}`,
  )
  console.log(
    chalk.gray(
      '\n  Storybook, linter, and type-checker are running...',
    ),
  )
}

const runLint = debounce(async () => {
  try {
    await execa('pnpm', ['run', '--silent', 'lint'], { stdio: 'inherit' })
    console.log(chalk.green('[lint] No lint errors found.'))
  } catch (error: any) {
    console.log(chalk.red('[lint] Errors were found.'))
  }
}, 300)

function prefixStream(
  stream: NodeJS.ReadableStream,
  prefix: string,
  options: { skip?: RegExp[] } = {},
) {
  let buffer = ''
  stream.on('data', (data: Buffer) => {
    buffer += data.toString()
    let eolIndex
    while ((eolIndex = buffer.indexOf('\n')) >= 0) {
      const line = buffer.substring(0, eolIndex + 1)
      buffer = buffer.substring(eolIndex + 1)

      if (!line.trim()) {
        continue
      }
      if (options.skip?.some((re) => re.test(line))) {
        continue
      }
      process.stdout.write(prefix + line)
    }
  })
}

function startStorybook(port: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const storybook = execa(
      'pnpm',
      ['storybook', 'dev', '-p', port, '--no-open', '--quiet'],
      {
        stdio: 'pipe',
        all: true,
      },
    )

    storybook.catch((error) => {
      if (!headerPrinted) {
        reject(error)
      }
    })

    const stream = storybook.all!
    const prefix = chalk.magenta('[dev-server] ')
    let buffer = ''

    stream.on('data', (data: Buffer) => {
      buffer += data.toString()
      let eolIndex

      while ((eolIndex = buffer.indexOf('\n')) >= 0) {
        const line = buffer.substring(0, eolIndex + 1)
        buffer = buffer.substring(eolIndex + 1)

        if (!line.trim()) {
          continue
        }

        process.stdout.write(prefix + line)

        if (
          !headerPrinted &&
          line.includes('STORYBOOK_SERVER_READY_SIGNAL')
        ) {
          resolve()
        }
      }

      if (
        !headerPrinted &&
        buffer.includes('STORYBOOK_SERVER_READY_SIGNAL')
      ) {
        process.stdout.write(prefix + buffer)
        resolve()
      }
    })

    storybook.on('close', (code) => {
      if (!headerPrinted) {
        reject(new Error(`Storybook exited with code ${code} before starting.`))
      } else if (code !== 0 && code !== null) {
        console.error(chalk.red(`[storybook] process exited with code ${code}`))
      }
    })

    storybook.on('error', (err) => {
      if (!headerPrinted) {
        reject(err)
      } else {
        console.error(chalk.red('[storybook] process error:'), err.message)
      }
    })
  })
}

async function run() {
  process.on('SIGINT', () => process.exit(0))
  process.on('SIGTERM', () => process.exit(0))

  const pkg = getPackageJson()
  const version = pkg.version
  const port = getPort(pkg.scripts.dev)

  try {
    console.log(chalk.gray('Starting Storybook (this may take a moment)...'))
    await startStorybook(port)

    printHeader(port, version)

    console.log(chalk.blue('\n[type-check] Starting watcher...'))
    const typeCheck = execa(
      'tsc',
      ['--noEmit', '--watch', '--preserveWatchOutput'],
      { stdio: 'pipe' },
    )

    prefixStream(typeCheck.stdout, chalk.blue('[type-check] '), {
      skip: [/Starting compilation/, /Watching for file changes/],
    })
    prefixStream(typeCheck.stderr, chalk.red('[type-check] '))

    console.log(chalk.yellow('[lint] Running check...'))
    await runLint()
    chokidar
      .watch('src/', {
        ignoreInitial: true,
        ignored: (file: string, _stats?: any) => {
          if (file.includes('node_modules')) {
            return true
          }
          if (_stats?.isFile()) {
            const keep = file.endsWith('.ts') || file.endsWith('.tsx')
            return !keep
          }
          return false
        },
      })
      .on('all', (event, path) => {
        console.log(chalk.yellow(`[lint] File ${event}. Re-running lint...`))
        runLint()
      })

    await typeCheck
  } catch (error: any) {
    console.error(chalk.red('\nClera UI dev script failed to start:'))
    console.error(error.message)
    process.exit(1)
  }
}

run()