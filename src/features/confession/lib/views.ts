import { getAnonymousId } from './anonymous-id'
import { supabase } from './supabase'

export async function recordPageView(pageKey: string) {
  if (!supabase) return false

  const { error } = await supabase.functions.invoke('record-page-view', {
    body: {
      pageKey,
      anonymousId: getAnonymousId(),
    },
  })

  if (error) {
    console.warn('Could not record page view', error)
    return false
  }

  return true
}
