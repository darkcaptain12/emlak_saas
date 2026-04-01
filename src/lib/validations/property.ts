import { z } from 'zod'

export const propertySchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalı'),
  description: z.string().optional(),
  property_type: z.enum(['apartment', 'house', 'land', 'commercial', 'other']),
  listing_type: z.enum(['sale', 'rent']),
  status: z.enum(['active', 'pending', 'sold', 'rented', 'passive']),
  price: z.coerce.number().positive('Fiyat pozitif olmalı'),
  currency: z.string(),
  area_sqm: z.union([z.literal(''), z.coerce.number().positive()]).optional().transform(v => v === '' ? undefined : v),
  rooms: z.union([z.literal(''), z.coerce.number().int().positive()]).optional().transform(v => v === '' ? undefined : v),
  bathrooms: z.union([z.literal(''), z.coerce.number().int().positive()]).optional().transform(v => v === '' ? undefined : v),
  floor: z.union([z.literal(''), z.coerce.number().int()]).optional().transform(v => v === '' ? undefined : v),
  total_floors: z.union([z.literal(''), z.coerce.number().int().positive()]).optional().transform(v => v === '' ? undefined : v),
  city: z.string().min(2, 'Şehir gerekli'),
  district: z.string().optional(),
  address_line: z.string().optional(),
})

export type PropertyFormValues = z.infer<typeof propertySchema>
