import type { JSZipObject } from 'jszip'

declare module 'jszip' {
  interface JSZipObjectWithData extends JSZipObject {
    _data: {
      compressedSize: number
      compression: {
        magic: string
      }
      crc32: number
      uncompressedSize: number
    }
  }
}
