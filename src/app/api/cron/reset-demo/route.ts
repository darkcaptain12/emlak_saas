import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Vercel cron güvenlik kontrolü
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Service role ile bağlan (RLS bypass için)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Demo kullanıcıları bul
  const { data: demoProfiles, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('is_demo', true)

  if (profileError || !demoProfiles?.length) {
    return NextResponse.json({ message: 'Demo kullanıcı bulunamadı' })
  }

  const demoUserIds = demoProfiles.map(p => p.id)
  const results: Record<string, unknown> = {}

  // Properties sil
  const { error: propError, count: propCount } = await supabase
    .from('properties')
    .delete()
    .in('user_id', demoUserIds)
  results.properties = propError ? propError.message : `${propCount ?? 0} silindi`

  // Leads sil
  const { error: leadError, count: leadCount } = await supabase
    .from('leads')
    .delete()
    .in('agent_id', demoUserIds)
  results.leads = leadError ? leadError.message : `${leadCount ?? 0} silindi`

  // Clients sil
  const { error: clientError, count: clientCount } = await supabase
    .from('clients')
    .delete()
    .in('agent_id', demoUserIds)
  results.clients = clientError ? clientError.message : `${clientCount ?? 0} silindi`

  console.log(`[CRON] Demo reset tamamlandı:`, results)

  return NextResponse.json({
    success: true,
    message: 'Demo veriler sıfırlandı',
    results,
    timestamp: new Date().toISOString(),
  })
}
