import { z } from 'zod'

export const leadSchema = z.object({
  client_id: z.string().uuid('Müşteri seçin'),
  property_id: z.string().uuid().optional(),
  status: z.enum(['new', 'contacted', 'viewing', 'offer', 'won', 'lost']),
  source: z.enum(['website', 'referral', 'social', 'portal', 'walk_in', 'other']).optional(),
  budget_min: z.number().positive().optional(),
  budget_max: z.number().positive().optional(),
  notes: z.string().optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>
