'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const DynamicGigMapDisplay = dynamic(() => import('./GigMapDisplay'), {
  loading: () => <div className="h-[200px] bg-gray-100 animate-pulse rounded-md" />,
  ssr: false
})

interface GigMapProps {
  location: string
  title?: string
  className?: string
}

export default function GigMap({ location, title, className }: GigMapProps) {
  const [center, setCenter] = useState({ longitude: -74.0060, latitude: 40.7128 }) // Default to NYC
  const [loading, setLoading] = useState(true)
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    const geocodeLocation = async () => {
      if (!accessToken || !location.trim()) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${accessToken}&types=address,poi`
        )
        const data = await response.json()
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center
          setCenter({ longitude: lng, latitude: lat })
        }
      } catch (error) {
        console.error('Geocoding error:', error)
      } finally {
        setLoading(false)
      }
    }

    geocodeLocation()
  }, [location, accessToken])

  if (!accessToken) {
    return (
      <div className={`bg-gray-100 rounded-md p-4 ${className || ''}`}>
        <div className="flex items-center space-x-2 text-gray-600">
          <span>📍</span>
          <span className="text-sm">{location}</span>
        </div>
        <p className="text-xs text-orange-600 mt-2">Mapbox not configured</p>
      </div>
    )
  }

  if (loading) {
    return <div className={`h-[200px] bg-gray-100 animate-pulse rounded-md ${className || ''}`} />
  }

  return (
    <div className={`border border-gray-300 rounded-md overflow-hidden ${className || ''}`}>
      <DynamicGigMapDisplay 
        center={center}
        zoom={15} 
        title={title}
      />
    </div>
  )
}