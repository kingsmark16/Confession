import { getAnonymousId } from '../confession/lib/anonymous-id'
import { supabase } from '../confession/lib/supabase'

export async function recordPasswordAttempt(passwordText: string, isCorrect: boolean) {
  if (!supabase) return

  const { error } = await supabase.from('password_attempts').insert({
    password_text: passwordText,
    is_correct: isCorrect,
    anonymous_id: getAnonymousId(),
  })

  if (error) {
    console.warn('Could not record password attempt', error)
  }
}
