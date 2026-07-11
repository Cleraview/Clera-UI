import '@testing-library/jest-dom'
import { MessageChannel as NodeMessageChannel } from 'node:worker_threads'
import { TextEncoder, TextDecoder } from 'node:util'

// jsdom doesn't implement these Web APIs; react-dom/server needs them
// (used by utils/legend.ts to render React-element legend icons to SVG).
// The ports are unref'd so a leftover channel can't keep the process alive.
if (typeof globalThis.MessageChannel === 'undefined') {
  class UnrefMessageChannel extends NodeMessageChannel {
    constructor() {
      super()
      this.port1.unref()
      this.port2.unref()
    }
  }
  // @ts-expect-error -- Node's MessageChannel is a compatible runtime stand-in
  globalThis.MessageChannel = UnrefMessageChannel
}
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder
}
if (typeof globalThis.TextDecoder === 'undefined') {
  // @ts-expect-error -- Node's TextDecoder is a compatible runtime stand-in
  globalThis.TextDecoder = TextDecoder
}
