import { z } from 'zod'

export const propertySchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalı'),
  description: z.string().optional(),
  property_type: z.enum(['apartment', 'house', 'land', 'commercial', 'other']),
  listing_type: z.enum(['sale', 'rent']),
  status: z.enum(['active', 'pending', 'sold', 'rented', 'passive']),
  price: z.number().positive('Fiyat pozitif olmalı'),
  currency: z.string(),
  area_sqm: z.number().positive().optional(),
  rooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  floor: z.number().int().optional(),
  total_floors: z.number().int().positive().optional(),
  city: z.string().min(2, 'Şehir gerekli'),
  district: z.string().optional(),
  address_line: z.string().optional(),
})

export type PropertyFormValues = z.infer<typeof propertySchema>
