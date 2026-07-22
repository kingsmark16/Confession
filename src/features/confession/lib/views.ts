import { getAnonymousId } from './anonymous-id'
import { supabase } from './supabase'

type VisitorLocation = {
  city: string
  country: string
}

type LocationResponse = {
  city?: unknown
  country_name?: unknown
}

async function getVisitorLocation(): Promise<VisitorLocation | null> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 3000)

  try {
    const response = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    if (!response.ok) return null

    const data = await response.json() as LocationResponse
    const country = typeof data.country_name === 'string' ? data.country_name.trim() : ''
    const city = typeof data.city === 'string' ? data.city.trim() : ''

    return country && city ? { country, city } : null
  } catch {
    return null
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function recordPageView(pageKey: string) {
  if (!supabase) return

  const anonymousId = getAnonymousId()
  const now = new Date().toISOString()
  const location = await getVisitorLocation()
  const { error: insertError } = await supabase.from('views').insert({
    page_key: pageKey,
    anonymous_id: anonymousId,
    first_viewed_at: now,
    last_seen_at: now,
    country: location?.country ?? null,
    city: location?.city ?? null,
  })

  if (!insertError) return
  if (insertError.code !== '23505') {
    console.warn('Could not record page view', insertError)
    return
  }

  const update = location
    ? { last_seen_at: now, country: location.country, city: location.city }
    : { last_seen_at: now }
  const { error: updateError } = await supabase.from('views').update(update)
    .eq('page_key', pageKey).eq('anonymous_id', anonymousId)

  if (updateError) {
    console.warn('Could not update page view', updateError)
  }
}
