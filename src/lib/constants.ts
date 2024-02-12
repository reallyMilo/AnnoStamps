import z from 'zod'

export const stampsPerPage =
  Number(process.env.NEXT_PUBLIC_STAMPS_PER_PAGE) || 20

export const filterSchema = z
  .object({
    capital: z.string(),
    category: z.string(),
    modded: z.string(),
    page: z.string(),
    region: z.string(),
    search: z.string(),
    sort: z.string(),
    townhall: z.string(),
    tradeunion: z.string(),
  })
  .partial()

export type FilterState = z.infer<typeof filterSchema>
