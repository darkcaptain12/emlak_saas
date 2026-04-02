import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Kiralığın belgelerini listele
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

    const { data: documents, error } = await supabase
      .from('rental_documents')
      .select('*')
      .eq('rental_id', rentalId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(documents || [])
  } catch (error) {
    console.error('[GET /api/rentals/[id]/documents]', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST - Yeni belge ekle
export async function POST(
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
  const { document_type, file_url, file_name, file_size_bytes } = await request.json()

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

    const { data: document, error } = await supabase
      .from('rental_documents')
      .insert([
        {
          rental_id: rentalId,
          document_type,
          file_url,
          file_name,
          file_size_bytes,
          uploaded_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(document, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/rentals/[id]/documents]', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
