import { z } from 'zod'

export const clientSchema = z.object({
  full_name: z.string().min(2, 'Ad soyad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir e-posta girin').or(z.literal('')).optional(),
  phone: z.string().optional(),
  client_type: z.enum(['buyer', 'seller', 'renter', 'landlord', 'other']),
  notes: z.string().optional(),
})

export type ClientFormValues = z.infer<typeof clientSchema>
