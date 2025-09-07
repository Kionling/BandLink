'use client'

import { useState, useEffect } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

interface GigMapDisplayProps {
  center: { longitude: number; latitude: number }
  zoom: number
  title?: string
}

function GigMapDisplay({ center, zoom, title }: GigMapDisplayProps) {
  const [viewState, setViewState] = useState({
    longitude: center.longitude,
    latitude: center.latitude,
    zoom
  })

  useEffect(() => {
    setViewState({
      longitude: center.longitude,
      latitude: center.latitude,
      zoom
    })
  }, [center.longitude, center.latitude, zoom])

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '1100px' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''}
      interactive={true}
    >
      <Marker
        longitude={center.longitude}
        latitude={center.latitude}
      >
        <div 
          className="bg-red-500 rounded-full w-4 h-4 border-2 border-white shadow-lg"
          title={title || 'Gig Location'}
        />
      </Marker>
    </Map>
  )
}

export default GigMapDisplay