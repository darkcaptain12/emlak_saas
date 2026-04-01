import { z } from 'zod'

export const propertySchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalı'),
  description: z.string().optional(),
  property_type: z.enum(['apartment', 'house', 'land', 'commercial', 'other']),
  listing_type: z.enum(['sale', 'rent']),
  status: z.enum(['active', 'pending', 'sold', 'rented', 'passive']),
  price: z.coerce.number().positive('Fiyat pozitif olmalı'),
  currency: z.string(),
  area_sqm: z.coerce.number().positive().optional().or(z.literal('')),
  rooms: z.coerce.number().int().positive().optional().or(z.literal('')),
  bathrooms: z.coerce.number().int().positive().optional().or(z.literal('')),
  floor: z.coerce.number().int().optional().or(z.literal('')),
  total_floors: z.coerce.number().int().positive().optional().or(z.literal('')),
  city: z.string().min(2, 'Şehir gerekli'),
  district: z.string().optional(),
  address_line: z.string().optional(),
}).transform((data) => ({
  ...data,
  area_sqm: data.area_sqm === '' ? undefined : data.area_sqm,
  rooms: data.rooms === '' ? undefined : data.rooms,
  bathrooms: data.bathrooms === '' ? undefined : data.bathrooms,
  floor: data.floor === '' ? undefined : data.floor,
  total_floors: data.total_floors === '' ? undefined : data.total_floors,
}))

export type PropertyFormValues = z.infer<typeof propertySchema>
