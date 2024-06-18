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
import { Asset, useUpload } from '@/lib/hooks/useUpload'
import { cn } from '@/lib/utils'

import { useStampFormContext } from './StampForm'

const isJSZip = (b: Asset | JSZipObjectWithData): b is JSZipObjectWithData => {
  return (b as JSZipObjectWithData)._data !== undefined
}
export const FileUpload = () => {
  const { status, files, setFiles } = useStampFormContext()
  const { isError, handleChange, handleRemove } = useUpload<
    Asset | JSZipObjectWithData
  >(files, setFiles)

  return (
    <div className="space-y-2">
      <div className="flex flex-row justify-between">
        <Subheading> Stamp File </Subheading>
        <label
          htmlFor="stamps"
          className={cn(
            buttonStyles.base,
            buttonStyles.solid,
            buttonStyles.colors.secondary,
            'font-normal hover:opacity-90'
          )}
        >
          Add Stamps
          <input
            type="file"
            id="stamps"
            name="stamps"
            onChange={handleChange}
            multiple
            hidden
            formNoValidate
          />
        </label>
      </div>

      <div className="mt-8 flow-root">
        <Table
          striped
          className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
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
                    onClick={() => handleRemove(file)}
                    className="cursor-pointer text-accent hover:text-accent/75"
                  >
                    delete
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {status === 'zip' && (
        <span className="text-sm text-red-600">Please add stamps</span>
      )}
      {isError && (
        <span className="text-sm text-red-600">File exceeds 1 MB</span>
      )}
    </div>
  )
}
