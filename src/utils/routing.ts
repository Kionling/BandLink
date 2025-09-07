export function openMapsForLocation(latitude: number, longitude: number, address?: string) {
  const encodedAddress = address ? encodeURIComponent(address) : `${latitude},${longitude}`
  
  // Check if user is on iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  
  // Check if user is on Android
  const isAndroid = /Android/.test(navigator.userAgent)
  
  let mapsUrl: string
  
  if (isIOS) {
    // Use Apple Maps on iOS
    mapsUrl = `https://maps.apple.com/?daddr=${latitude},${longitude}`
  } else if (isAndroid) {
    // Use Google Maps on Android
    mapsUrl = `https://maps.google.com/maps?daddr=${latitude},${longitude}`
  } else {
    // Use Google Maps for desktop/other platforms
    mapsUrl = `https://maps.google.com/maps?daddr=${encodedAddress}`
  }
  
  window.open(mapsUrl, '_blank')
}

export function openMapsForDirections(
  fromLat?: number, 
  fromLng?: number, 
  toLat?: number, 
  toLng?: number, 
  toAddress?: string
) {
  if (!toLat || !toLng) return
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  
  let mapsUrl: string
  
  if (isIOS) {
    if (fromLat && fromLng) {
      mapsUrl = `https://maps.apple.com/?saddr=${fromLat},${fromLng}&daddr=${toLat},${toLng}`
    } else {
      mapsUrl = `https://maps.apple.com/?daddr=${toLat},${toLng}`
    }
  } else if (isAndroid) {
    if (fromLat && fromLng) {
      mapsUrl = `https://maps.google.com/maps?saddr=${fromLat},${fromLng}&daddr=${toLat},${toLng}`
    } else {
      mapsUrl = `https://maps.google.com/maps?daddr=${toLat},${toLng}`
    }
  } else {
    const destination = toAddress ? encodeURIComponent(toAddress) : `${toLat},${toLng}`
    if (fromLat && fromLng) {
      mapsUrl = `https://maps.google.com/maps?saddr=${fromLat},${fromLng}&daddr=${destination}`
    } else {
      mapsUrl = `https://maps.google.com/maps?daddr=${destination}`
    }
  }
  
  window.open(mapsUrl, '_blank')
}