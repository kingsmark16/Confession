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
  const draft = { answer, message: message ?? null }
  const { error } = await supabase.from('responses').upsert({
    id,
    anonymous_id: getAnonymousId(),
    answer,
    message: draft.message,
  }, { onConflict: 'anonymous_id' })

  if (error) throw error
  writeDraft(draft)
  window.localStorage.setItem(responseIdKey, id)
  return id
}

export async function updateResponse(id: string, answer: 'yes' | 'no') {
  if (!supabase) return
  const draft = { ...readDraft(), answer }
  const { error } = await supabase.from('responses').upsert({
    id,
    anonymous_id: getAnonymousId(),
    ...draft,
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
