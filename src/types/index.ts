export type Role = 'super_admin' | 'customer_user'
export type PackageType = 'pack1' | 'pack2' | 'pack3'

export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial' | 'other'
export type ListingType = 'sale' | 'rent'
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'passive'
export type ClientType = 'buyer' | 'seller' | 'renter' | 'landlord' | 'other'
export type LeadStatus = 'new' | 'contacted' | 'viewing' | 'offer' | 'won' | 'lost'
export type LeadSource = 'website' | 'referral' | 'social' | 'portal' | 'walk_in' | 'other'

export interface Profile {
  id: string
  full_name: string
  agency_name: string | null
  phone: string | null
  avatar_url: string | null
  role: Role
  package_type: PackageType
  is_active: boolean
  package_started_at: string | null
  package_updated_at: string | null
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  agent_id: string
  title: string
  description: string | null
  property_type: PropertyType
  listing_type: ListingType
  status: PropertyStatus
  price: number
  currency: string
  area_sqm: number | null
  rooms: number | null
  bathrooms: number | null
  floor: number | null
  total_floors: number | null
  address_line: string | null
  district: string | null
  city: string
  latitude: number | null
  longitude: number | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  property_images?: PropertyImage[]
}

export interface PropertyImage {
  id: string
  property_id: string
  storage_path: string
  is_cover: boolean
  sort_order: number
  created_at: string
}

export interface Client {
  id: string
  agent_id: string
  full_name: string
  email: string | null
  phone: string | null
  client_type: ClientType
  notes: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  agent_id: string
  client_id: string
  property_id: string | null
  status: LeadStatus
  source: LeadSource | null
  budget_min: number | null
  budget_max: number | null
  notes: string | null
  created_at: string
  updated_at: string
  clients?: Client
  properties?: Property | null
}

export interface LeadNote {
  id: string
  lead_id: string
  agent_id: string
  body: string
  created_at: string
}

export type RentalStatus = 'active' | 'ended' | 'paused'
export type RentalPaymentStatus = 'pending' | 'paid' | 'late' | 'partial'
export type RentalDocumentType = 'lease' | 'identification' | 'other'
export type RentalCommunicationType = 'note' | 'reminder' | 'complaint' | 'other'

export interface Rental {
  id: string
  property_id: string
  tenant_id: string
  agent_id: string
  monthly_rent_amount: number
  rent_due_day: number
  start_date: string
  end_date: string | null
  status: RentalStatus
  notes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null

  // Relations (optional, populated on demand)
  property?: Property
  tenant?: Client
  payments?: RentalPayment[]
}

export interface RentalPayment {
  id: string
  rental_id: string
  due_date: string
  paid_date: string | null
  amount_due: number
  amount_paid: number | null
  status: RentalPaymentStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface RentalDocument {
  id: string
  rental_id: string
  document_type: RentalDocumentType
  file_url: string
  file_name: string
  file_size_bytes: number | null
  uploaded_by: string | null
  created_at: string
  deleted_at: string | null
}

export interface RentalCommunicationLog {
  id: string
  rental_id: string
  message: string
  message_type: RentalCommunicationType
  logged_by: string
  created_at: string
}
