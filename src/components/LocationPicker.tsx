'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'

const DynamicMapComponent = dynamic(() => import('./MapComponent'), {
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-md" />,
  ssr: false
})

interface LocationPickerProps {
  value: string
  onChange: (location: string, coordinates?: { lat: number; lng: number }) => void
  placeholder?: string
  className?: string
}

export default function LocationPicker({ value, onChange, placeholder = "Enter location", className }: LocationPickerProps) {
  const [showMap, setShowMap] = useState(false)
  const [searchValue, setSearchValue] = useState(value)

  // Update searchValue when value prop changes
  useEffect(() => {
    setSearchValue(value)
  }, [value])
  const [center, setCenter] = useState({ longitude: -74.0060, latitude: 40.7128 }) // Default to NYC

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    onChange(newValue)
  }

  const handleSearchLocation = useCallback(async () => {
    if (!searchValue.trim()) return
    
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!accessToken) return

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchValue)}.json?access_token=${accessToken}&types=address,poi`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0]
        const [lng, lat] = feature.center
        const newCenter = { longitude: lng, latitude: lat }
        setCenter(newCenter)
        setShowMap(true)
        onChange(feature.place_name, { lat, lng })
        setSearchValue(feature.place_name)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }, [searchValue, onChange])

  const handleMarkerChange = useCallback((location: string, coordinates: { lat: number; lng: number }) => {
    setSearchValue(location)
    onChange(location, coordinates)
  }, [onChange])

  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  if (!accessToken) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={className || "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"}
        />
        <p className="text-sm text-orange-600">Mapbox access token not configured. Using text input only.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={className || "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"}
        />
        <button
          type="button"
          onClick={handleSearchLocation}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          📍 Search
        </button>
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>
      
      {showMap && (
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <DynamicMapComponent 
            center={center} 
            zoom={15} 
            onMarkerChange={handleMarkerChange}
            accessToken={accessToken}
          />
        </div>
      )}
    </div>
  )
}