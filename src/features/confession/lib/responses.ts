import { supabase } from './supabase'
import { getAnonymousId } from './anonymous-id'

const responseDraftKey = 'confession-response-draft'
const responseIdKey = 'confession-response-id'

type ResponseDraft = { answer: 'yes' | 'no' | null; message: string | null }

function readDraft(): ResponseDraft {
  const rawDraft = window.localStorage.getItem(responseDraftKey)
  if (!rawDraft) return { answer: null, message: null }
  try {
    return JSON.parse(rawDraft) as ResponseDraft
  } catch {
    return { answer: null, message: null }
  }
}

function writeDraft(draft: ResponseDraft) {
  window.localStorage.setItem(responseDraftKey, JSON.stringify(draft))
}

export function getStoredResponseId() {
  return window.localStorage.getItem(responseIdKey)
}

export async function createResponse(answer: 'yes' | 'no' | null, message?: string) {
  if (!supabase) return null

  const id = crypto.randomUUID()
  const anonymousId = getAnonymousId()
  const draft = { answer, message: message ?? null }
  const { error } = await supabase.from('responses').insert({
    id,
    anonymous_id: anonymousId,
    answer,
    message: draft.message,
    first_answer: answer,
    answer_update_count: 0,
  })

  if (error && error.code !== '23505') throw error
  if (error?.code === '23505') {
    const { error: firstAnswerError } = await supabase.from('responses').update({
      first_answer: answer,
      answer_update_count: 0,
    }).eq('anonymous_id', anonymousId).is('first_answer', null).is('answer', null)
    if (firstAnswerError) throw firstAnswerError

    const { error: updateError } = await supabase.from('responses').update({
      answer,
      message: draft.message,
    }).eq('anonymous_id', anonymousId)
    if (updateError) throw updateError
  }
  writeDraft(draft)
  window.localStorage.setItem(responseIdKey, id)
  return id
}

export async function updateResponse(id: string, answer: 'yes' | 'no') {
  if (!supabase) return
  const previousDraft = readDraft()
  const draft = { ...previousDraft, answer }

  if (previousDraft.answer === null) {
    const { error: firstAnswerError } = await supabase.from('responses').update({
      first_answer: answer,
      answer_update_count: 0,
    }).eq('anonymous_id', getAnonymousId()).is('first_answer', null).is('answer', null)
    if (firstAnswerError) throw firstAnswerError
  }

  const { error } = await supabase.from('responses').upsert({
    id,
    anonymous_id: getAnonymousId(),
    ...draft,
    ...(previousDraft.answer === null ? { first_answer: answer, answer_update_count: 0 } : {}),
  }, { onConflict: 'anonymous_id' })
  if (error) throw error
  writeDraft(draft)
}

export async function updateResponseMessage(id: string, message: string) {
  if (!supabase) throw new Error('Supabase is not configured')
  const draft = { ...readDraft(), message }
  const { error } = await supabase.from('responses').upsert({
    id,
    anonymous_id: getAnonymousId(),
    ...draft,
  }, { onConflict: 'anonymous_id' })
  if (error) throw error
  writeDraft(draft)
}
