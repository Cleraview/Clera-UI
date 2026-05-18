declare module '*.jpg' {
  const content: import('next/image').StaticImageData
  export default content
}

declare module '*.png' {
  const content: import('next/image').StaticImageData
  export default content
}

declare module '*.svg' {
  import * as React from 'react'
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module '*.svg?url' {
  const url: string
  export default url
}
