import { getAnonymousId } from './anonymous-id'
import { supabase } from './supabase'

export async function recordPageView(pageKey: string) {
  if (!supabase) return

  const anonymousId = getAnonymousId()
  const now = new Date().toISOString()
  const { error: insertError } = await supabase.from('views').insert({
    page_key: pageKey,
    anonymous_id: anonymousId,
    first_viewed_at: now,
    last_seen_at: now,
  })

  if (!insertError) return
  if (insertError.code !== '23505') {
    console.warn('Could not record page view', insertError)
    return
  }

  const { error: updateError } = await supabase.from('views').update({
    last_seen_at: now,
  }).eq('page_key', pageKey).eq('anonymous_id', anonymousId)

  if (updateError) {
    console.warn('Could not update page view', updateError)
  }
}
