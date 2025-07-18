declare global {
  interface Window {
    initGoogleMaps?: () => void
  }
}

let isLoaded = false
let isLoading = false
let loadPromise: Promise<void> | null = null

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

export const loadGoogleMapsScript = (): Promise<void> => {
  // Check if already loaded
  if (isLoaded && window.google?.maps?.places) {
    return Promise.resolve()
  }

  // Return existing promise if currently loading
  if (isLoading && loadPromise) {
    return loadPromise
  }

  // Check for missing API key
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error('Google Maps API key is not configured'))
  }

  isLoading = true

  loadPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.getElementById('google-maps-script')
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        isLoaded = true
        isLoading = false
        resolve()
      })
      existingScript.addEventListener('error', () => {
        isLoading = false
        reject(new Error('Failed to load Google Maps script'))
      })
      return
    }

    // Create new script
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true

    // Define callback
    window.initGoogleMaps = () => {
      isLoaded = true
      isLoading = false
      resolve()
      delete window.initGoogleMaps
    }

    script.onerror = () => {
      isLoading = false
      reject(new Error('Failed to load Google Maps script'))
      delete window.initGoogleMaps
    }

    document.head.appendChild(script)
  })

  return loadPromise
}

export const isGoogleMapsLoaded = () => isLoaded && window.google?.maps?.places
