import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

type PageViewPayload = {
  pageKey?: unknown
  anonymousId?: unknown
}

type LocationResponse = {
  success?: unknown
  city?: unknown
  country?: unknown
}

type VisitorLocation = {
  city: string
  country: string
}

const jsonHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
}
const rateLimitWindowMs = 10_000
const recentRequests = new Map<string, number>()

function jsonResponse(body: Record<string, boolean>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  })
}

function getVisitorIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const forwardedIp = forwardedFor?.split(',')[0]?.trim()
  const directIp = request.headers.get('x-real-ip')?.trim()
  const cloudflareIp = request.headers.get('cf-connecting-ip')?.trim()
  const ip = forwardedIp || directIp || cloudflareIp || ''

  return /^[0-9a-f:.]+$/i.test(ip) ? ip : null
}

async function getVisitorLocation(ip: string): Promise<VisitorLocation | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000)

  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country,city`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) return null

    const data = await response.json() as LocationResponse
    if (data.success !== true) return null

    const country = typeof data.country === 'string' ? data.country.trim() : ''
    const city = typeof data.city === 'string' ? data.city.trim() : ''

    return country && city ? { country, city } : null
  } catch {
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function isRateLimited(anonymousId: string) {
  const now = Date.now()
  for (const [requestId, timestamp] of recentRequests) {
    if (now - timestamp >= rateLimitWindowMs) {
      recentRequests.delete(requestId)
    }
  }

  const lastRequest = recentRequests.get(anonymousId)
  recentRequests.set(anonymousId, now)

  return lastRequest !== undefined && now - lastRequest < rateLimitWindowMs
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const admin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: jsonHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false }, 405)
  }

  if (!admin) {
    console.error('Supabase server configuration is missing')
    return jsonResponse({ ok: false }, 500)
  }

  try {
    const payload = await request.json() as PageViewPayload
    if (payload.pageKey !== 'confession' || !isUuid(payload.anonymousId)) {
      return jsonResponse({ ok: false }, 400)
    }

    const now = new Date().toISOString()
    if (isRateLimited(payload.anonymousId)) {
      return jsonResponse({ ok: false }, 429)
    }

    const visitorIp = getVisitorIp(request)
    const location = visitorIp ? await getVisitorLocation(visitorIp) : null

    const { error: insertError } = await admin.from('views').insert({
      page_key: payload.pageKey,
      anonymous_id: payload.anonymousId,
      first_viewed_at: now,
      last_seen_at: now,
      country: location?.country ?? null,
      city: location?.city ?? null,
    })

    if (!insertError) {
      return jsonResponse({ ok: true })
    }
    if (insertError.code !== '23505') {
      console.error('Could not insert page view', insertError)
      return jsonResponse({ ok: false }, 500)
    }

    const update = location
      ? { last_seen_at: now, country: location.country, city: location.city }
      : { last_seen_at: now }
    const { error: updateError } = await admin.from('views').update(update)
      .eq('page_key', payload.pageKey).eq('anonymous_id', payload.anonymousId)

    if (updateError) {
      console.error('Could not update page view', updateError)
      return jsonResponse({ ok: false }, 500)
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    console.error('Could not process page view', error)
    return jsonResponse({ ok: false }, 400)
  }
})
