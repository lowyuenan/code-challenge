import { z } from 'zod'

export const priceSchema = z.object({
  currency: z.string(),
  date: z.string(),
  price: z.number().min(0),
})

export type Price = z.output<typeof priceSchema>
