'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

interface MapComponentProps {
  center: { longitude: number; latitude: number }
  zoom: number
  onMarkerChange: (location: string, coordinates: { lat: number; lng: number }) => void
  accessToken: string
}

function MapComponent({ center, zoom, onMarkerChange, accessToken }: MapComponentProps) {
  const [viewState, setViewState] = useState({
    longitude: center.longitude,
    latitude: center.latitude,
    zoom
  })
  const [marker, setMarker] = useState(center)
  const geocoderRef = useRef<MapboxGeocoder>()
  const mapRef = useRef<any>()

  useEffect(() => {
    if (mapRef.current && !geocoderRef.current) {
      const geocoder = new MapboxGeocoder({
        accessToken,
        mapboxgl: undefined,
        marker: false,
        placeholder: 'Search for a location...'
      })
      
      geocoder.on('result', (e) => {
        const { center, place_name } = e.result
        const newCoords = { longitude: center[0], latitude: center[1] }
        setMarker(newCoords)
        setViewState(prev => ({ ...prev, ...newCoords }))
        onMarkerChange(place_name, { lat: center[1], lng: center[0] })
      })
      
      geocoderRef.current = geocoder
      mapRef.current.getMap().addControl(geocoder, 'top-left')
    }
  }, [accessToken, onMarkerChange])

  const handleMapClick = useCallback(async (event: any) => {
    const { lng, lat } = event.lngLat
    setMarker({ longitude: lng, latitude: lat })
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&types=address`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        onMarkerChange(data.features[0].place_name, { lat, lng })
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }, [accessToken, onMarkerChange])

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '500px' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={accessToken}
      onClick={handleMapClick}
    >
      <Marker
        longitude={marker.longitude}
        latitude={marker.latitude}
        draggable
        onDragEnd={handleMapClick}
      >
        <div className="bg-red-500 rounded-full w-4 h-4 border-2 border-white shadow-lg" />
      </Marker>
    </Map>
  )
}

export default MapComponent