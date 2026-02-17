export const ALLOW_117_STAMP_WRITES = false

export const STAMP_117_WRITE_BLOCKED_MESSAGE =
  'Anno 117 uploads are not available yet. Use the version switcher in the top header to select 1800 for create or edit.'

export const is117StampWriteBlocked = (game: string) =>
  game === '117' && !ALLOW_117_STAMP_WRITES
