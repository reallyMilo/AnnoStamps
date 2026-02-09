import type { ChangeEvent } from 'react'

import { useState } from 'react'

import { act, renderHook } from '@/__tests__/test-utils'

import { type Asset, fileToAsset, useUpload } from '../useUpload'

const createFileList = (files: File[]): FileList =>
  ({
    item: (index: number) => files[index] ?? null,
    length: files.length,
  }) as FileList

describe('useUpload', () => {
  let createObjectURL: ReturnType<typeof vi.fn>
  let revokeObjectURL: ReturnType<typeof vi.fn>
  let counter = 0

  beforeEach(() => {
    counter = 0
    createObjectURL = vi.fn(() => `blob:mock-${++counter}`)
    revokeObjectURL = vi.fn()
    Object.defineProperty(global.URL, 'createObjectURL', {
      value: createObjectURL,
      writable: true,
    })
    Object.defineProperty(global.URL, 'revokeObjectURL', {
      value: revokeObjectURL,
      writable: true,
    })
  })

  it('enforces the global file limit', () => {
    const initial = Array.from({ length: 9 }, (_, i) =>
      fileToAsset(
        new File(['a'], `a${i}.png`, {
          type: 'image/png',
        }),
      ),
    )

    const { result } = renderHook(() => {
      const [files, setFiles] = useState<Asset[]>(initial)
      return { files, ...useUpload<Asset>(files, setFiles) }
    })

    const newFiles = [
      new File(['b'], 'b.png', { type: 'image/png' }),
      new File(['c'], 'c.png', { type: 'image/png' }),
    ]

    act(() => {
      result.current.handleChange({
        currentTarget: { files: createFileList(newFiles) },
      } as ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.error).toBe('limit')
    expect(result.current.files).toHaveLength(9)
  })

  it('revokes object URLs on remove', async () => {
    const assetOne = fileToAsset(
      new File(['a'], 'a.png', { type: 'image/png' }),
    )
    const assetTwo = fileToAsset(
      new File(['b'], 'b.png', { type: 'image/png' }),
    )

    const { result } = renderHook(() => {
      const [files, setFiles] = useState<Asset[]>([assetOne, assetTwo])
      return { files, ...useUpload<Asset>(files, setFiles) }
    })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    act(() => {
      result.current.handleRemove(assetOne)
    })

    expect(revokeObjectURL).toHaveBeenCalledWith(assetOne.url)
  })
})
