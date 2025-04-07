'use client'
import type { JSZipObjectWithData } from 'jszip'

import {
  buttonStyles,
  Subheading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { cn } from '@/lib/utils'

import { useStampFormContext } from './StampForm'
import { type Asset, useUpload } from './useUpload'

const isJSZip = (b: Asset | JSZipObjectWithData): b is JSZipObjectWithData => {
  return (b as JSZipObjectWithData)._data !== undefined
}
export const FileUpload = () => {
  const { files, setFiles, status } = useStampFormContext()
  const { handleChange, handleRemove, isError } = useUpload<
    Asset | JSZipObjectWithData
  >(files, setFiles)

  return (
    <div className="space-y-2">
      <div className="flex flex-row justify-between">
        <Subheading> Stamp File </Subheading>
        <label
          className={cn(
            buttonStyles.base,
            buttonStyles.solid,
            buttonStyles.colors.secondary,
            'font-normal hover:opacity-90',
          )}
          htmlFor="stamps"
        >
          Add Stamps
          <input
            formNoValidate
            hidden
            id="stamps"
            multiple
            name="stamps"
            onChange={handleChange}
            type="file"
          />
        </label>
      </div>

      <div className="mt-8 flow-root">
        <Table
          className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]"
          striped
        >
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Size</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell className="font-medium">
                  Add one or more stamps
                </TableCell>
              </TableRow>
            ) : (
              files.map((file, idx) => (
                <TableRow key={`${file.name}-${idx}`}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>
                    {isJSZip(file)
                      ? file._data.uncompressedSize / 1000
                      : file.size}{' '}
                    kb
                  </TableCell>
                  <TableCell
                    className="text-accent hover:text-accent/75 cursor-pointer"
                    onClick={() => handleRemove(file)}
                  >
                    delete
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {status === 'invalidZip' && (
        <span className="text-sm text-red-600">Please add stamps</span>
      )}
      {isError && (
        <span className="text-sm text-red-600">File exceeds 1 MB</span>
      )}
    </div>
  )
}
