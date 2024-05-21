export const CATEGORIES = {
  Production: 'production',
  Cosmetic: 'cosmetic',
  Housing: 'housing',
  Island: 'island',
  General: 'general',
} as const

export const SORT_OPTIONS = {
  Downloads: 'downloads',
  Newest: 'newest',
  Likes: 'likes',
} as const

export const STAMPS_PER_PAGE =
  Number(process.env.NEXT_PUBLIC_STAMPS_PER_PAGE) || 20
