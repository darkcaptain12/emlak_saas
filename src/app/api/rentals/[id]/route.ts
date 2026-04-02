import { createClient } from '@/lib/supabase/server'
import { rentalFormSchema } from '@/lib/validations/rental'
import { NextRequest, NextResponse } from 'next/server'

// GET - Kiracı detayını getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const { data: rental, error } = await supabase
      .from('rentals')
      .select(`
        *,
        property:properties(*),
        tenant:clients(*),
        payments:rental_payments(*)
      `)
      .eq('id', id)
      .eq('agent_id', user.id)
      .is('deleted_at', null)
      .single()

    if (error || !rental) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 })
    }

    return NextResponse.json(rental)
  } catch (error) {
    console.error('[GET /api/rentals/[id]]', error)
    return NextResponse.json({ error: 'Failed to fetch rental' }, { status: 500 })
  }
}

// PUT - Kiracı bilgilerini güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    // Check ownership
    const { data: existing } = await supabase
      .from('rentals')
      .select('agent_id')
      .eq('id', id)
      .single()

    if (!existing || existing.agent_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const validated = rentalFormSchema.parse(body)

    const { data: rental, error } = await supabase
      .from('rentals')
      .update({
        tenant_id: validated.tenant_id,
        monthly_rent_amount: validated.monthly_rent_amount,
        rent_due_day: validated.rent_due_day,
        start_date: validated.start_date,
        end_date: validated.end_date || null,
        notes: validated.notes || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(rental)
  } catch (error: any) {
    console.error('[PUT /api/rentals/[id]]', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Failed to update rental' }, { status: 500 })
  }
}

// DELETE - Kiracılığı sonlandır (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    // Check ownership
    const { data: existing } = await supabase
      .from('rentals')
      .select('agent_id')
      .eq('id', id)
      .single()

    if (!existing || existing.agent_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('rentals')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/rentals/[id]]', error)
    return NextResponse.json({ error: 'Failed to delete rental' }, { status: 500 })
  }
}
