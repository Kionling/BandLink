'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Gig } from '@/types'

const DynamicGigMapDisplay = dynamic(() => import('./GigMapDisplay'), {
  loading: () => <div className="h-full bg-gray-100 animate-pulse rounded-md flex items-center justify-center"><span className="text-gray-500">Loading map...</span></div>,
  ssr: false
})

interface PersistentMapProps {
  selectedGig: Gig | null
  gigs: Gig[]
  className?: string
}

export default function PersistentMap({ selectedGig, gigs, className }: PersistentMapProps) {
  const [center, setCenter] = useState({ longitude: -74.0060, latitude: 40.7128 }) // Default to NYC
  const [loading, setLoading] = useState(false)
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (selectedGig && selectedGig.latitude && selectedGig.longitude) {
      setCenter({
        longitude: selectedGig.longitude,
        latitude: selectedGig.latitude
      })
    } else if (selectedGig && selectedGig.location) {
      // Geocode the location if coordinates aren't available
      geocodeLocation(selectedGig.location)
    }
  }, [selectedGig])

  const geocodeLocation = async (location: string) => {
    if (!accessToken || !location.trim()) return

    setLoading(true)
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

  if (!accessToken) {
    return (
      <div className={`bg-gray-100 rounded-lg p-6 flex items-center justify-center ${className || ''}`}>
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-4">🗺️</div>
          <p className="text-sm">Map unavailable</p>
          <p className="text-xs text-orange-600 mt-1">Mapbox not configured</p>
          {selectedGig && (
            <div className="mt-4 p-3 bg-white rounded border text-left">
              <p className="text-sm font-medium">{selectedGig.title}</p>
              <p className="text-xs text-gray-600">{selectedGig.location}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className || ''}`}>
      {selectedGig ? (
        <>
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-medium text-gray-900">{selectedGig.title}</h3>
            <p className="text-sm text-gray-600">{selectedGig.location}</p>
          </div>
          <div className=" relative h-[1100px]">
            {loading ? (
              <div className="h-full bg-gray-100 animate-pulse flex items-center justify-center">
                <span className="text-gray-500">Finding location...</span>
              </div>
            ) : (
              <DynamicGigMapDisplay 
                center={center}
                zoom={15} 
                title={selectedGig.title}
              />
            )}
          </div>
        </>
      ) : (
        <div className="h-[500px] bg-gray-50 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">🗺️</div>
            <p className="text-sm">Select a gig to view location</p>
          </div>
        </div>
      )}
    </div>
  )
}