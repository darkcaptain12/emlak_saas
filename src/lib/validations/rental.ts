import { z } from 'zod'

export const rentalFormSchema = z.object({
  tenant_id: z.string().uuid('Kiracı seçilmelidir'),
  monthly_rent_amount: z.coerce
    .number()
    .positive('Kira tutarı pozitif olmalı'),
  rent_due_day: z.coerce
    .number()
    .int('Gün tam sayı olmalı')
    .min(1, 'Gün 1 ile 31 arasında olmalı')
    .max(31, 'Gün 1 ile 31 arasında olmalı'),
  start_date: z.string().date('Başlama tarihi seçilmelidir'),
  end_date: z.string().date().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type RentalFormValues = z.infer<typeof rentalFormSchema>
