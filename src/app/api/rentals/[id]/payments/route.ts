import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Kiralığın ödeme tarihçesini getir
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

  const { id: rentalId } = await params

  try {
    // Verify ownership
    const { data: rental } = await supabase
      .from('rentals')
      .select('agent_id')
      .eq('id', rentalId)
      .single()

    if (!rental || rental.agent_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: payments, error } = await supabase
      .from('rental_payments')
      .select('*')
      .eq('rental_id', rentalId)
      .order('due_date', { ascending: false })

    if (error) throw error

    return NextResponse.json(payments || [])
  } catch (error) {
    console.error('[GET /api/rentals/[id]/payments]', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// PATCH - Ödeme durumunu güncelle
export async function PATCH(
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

  const { id: rentalId } = await params
  const { paymentId, status, paid_date } = await request.json()

  try {
    // Verify rental ownership
    const { data: rental } = await supabase
      .from('rentals')
      .select('agent_id')
      .eq('id', rentalId)
      .single()

    if (!rental || rental.agent_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Determine status: if paid_date is set, status is 'paid', otherwise check if due_date passed
    let finalStatus = status

    if (status === 'paid') {
      finalStatus = 'paid'
    } else {
      const { data: payment } = await supabase
        .from('rental_payments')
        .select('due_date')
        .eq('id', paymentId)
        .single()

      if (payment) {
        const today = new Date()
        const dueDate = new Date(payment.due_date)
        finalStatus = dueDate < today ? 'late' : 'pending'
      }
    }

    const { data: updated, error } = await supabase
      .from('rental_payments')
      .update({
        status: finalStatus,
        paid_date: paid_date || null,
      })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('[PATCH /api/rentals/[id]/payments]', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}
