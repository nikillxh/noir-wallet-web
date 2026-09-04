/// <reference types="vite/client" />

declare module '*.typeface.json' {
  import type { Text3DProps } from '@react-three/drei'

  const font: Text3DProps['font']
  export default font
}
