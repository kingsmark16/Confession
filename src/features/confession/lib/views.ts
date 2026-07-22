import { getAnonymousId } from './anonymous-id'
import { supabase } from './supabase'

export type PageViewLocation = {
  city: string
  country: string
}

type ReverseGeocodeResponse = {
  city?: unknown
  locality?: unknown
  countryName?: unknown
}

type PreciseLocationStatus = 'success' | 'denied' | 'unavailable' | 'error'

async function reverseGeocode(latitude: number, longitude: number): Promise<PageViewLocation | null> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 5000)

  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      localityLanguage: 'en',
    })
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`, {
      signal: controller.signal,
    })
    if (!response.ok) return null

    const data = await response.json() as ReverseGeocodeResponse
    const country = typeof data.countryName === 'string' ? data.countryName.trim() : ''
    const cityValue = typeof data.city === 'string' ? data.city : data.locality
    const city = typeof cityValue === 'string' ? cityValue.trim() : ''

    return country && city ? { country, city } : null
  } catch {
    return null
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function recordPageView(pageKey: string, location?: PageViewLocation) {
  if (!supabase) return false

  const { error } = await supabase.functions.invoke('record-page-view', {
    body: {
      pageKey,
      anonymousId: getAnonymousId(),
      location,
    },
  })

  if (error) {
    console.warn('Could not record page view', error)
    return false
  }

  return true
}

export function requestPreciseLocation(pageKey: string): Promise<PreciseLocationStatus> {
  if (!supabase || !window.isSecureContext || !navigator.geolocation) {
    return Promise.resolve('unavailable')
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const location = await reverseGeocode(coords.latitude, coords.longitude)
      if (!location) {
        resolve('error')
        return
      }

      const recorded = await recordPageView(pageKey, location)
      resolve(recorded ? 'success' : 'error')
    }, (error) => {
      resolve(error.code === GeolocationPositionError.PERMISSION_DENIED ? 'denied' : 'error')
    }, {
      enableHighAccuracy: true,
      maximumAge: 300_000,
      timeout: 10_000,
    })
  })
}
