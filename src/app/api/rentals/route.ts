import { createClient } from '@/lib/supabase/server'
import { rentalFormSchema } from '@/lib/validations/rental'
import type { Rental, RentalPayment } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

// GET - İlanın kiracılarını listele
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const propertyId = searchParams.get('property_id')

  if (!propertyId) {
    return NextResponse.json({ error: 'property_id required' }, { status: 400 })
  }

  try {
    const { data: rentals, error } = await supabase
      .from('rentals')
      .select(`
        *,
        property:properties(*),
        tenant:clients(*)
      `)
      .eq('property_id', propertyId)
      .eq('agent_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(rentals || [])
  } catch (error) {
    console.error('[GET /api/rentals]', error)
    return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 })
  }
}

// POST - Yeni kiracı ekle
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Validation
    const validated = rentalFormSchema.parse(body)

    // Check property ownership
    const { data: property } = await supabase
      .from('properties')
      .select('id, user_id')
      .eq('id', body.property_id)
      .single()

    if (!property || property.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Property not found or unauthorized' },
        { status: 403 }
      )
    }

    // Create rental
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .insert([
        {
          property_id: body.property_id,
          tenant_id: validated.tenant_id,
          agent_id: user.id,
          monthly_rent_amount: validated.monthly_rent_amount,
          rent_due_day: validated.rent_due_day,
          start_date: validated.start_date,
          end_date: validated.end_date || null,
          notes: validated.notes || null,
          status: 'active',
        },
      ])
      .select()
      .single()

    if (rentalError) throw rentalError

    // Otomastik 12 ay için ödeme satırları oluştur (Pack2+)
    if (rental) {
      const payments: RentalPayment[] = []
      const startDate = new Date(validated.start_date)

      for (let month = 0; month < 12; month++) {
        const dueDate = new Date(startDate)
        dueDate.setMonth(dueDate.getMonth() + month)
        dueDate.setDate(Math.min(validated.rent_due_day, new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0).getDate()))

        payments.push({
          rental_id: rental.id,
          due_date: dueDate.toISOString().split('T')[0],
          amount_due: validated.monthly_rent_amount,
          status: 'pending',
        } as any)
      }

      if (payments.length > 0) {
        await supabase.from('rental_payments').insert(payments).select()
      }
    }

    return NextResponse.json(rental, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/rentals]', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Failed to create rental' }, { status: 500 })
  }
}
