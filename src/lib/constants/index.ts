import z from 'zod'

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

export const queryParamsSchema = z
  .object({
    capital: z.union([z.string().array(), z.string()]),
    category: z.union([z.string().array(), z.string()]),
    page: z.string(),
    region: z.union([z.string().array(), z.string()]),
    search: z.string(),
    sort: z.string(),
  })
  .partial()

export type QueryParams = z.infer<typeof queryParamsSchema>
