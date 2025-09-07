'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Calendar from '@/components/Calendar'
import GigForm from '@/components/GigForm'
import { Gig, CreateGigData } from '@/types'
import { format } from 'date-fns'
import { openMapsForDirections } from '@/utils/routing'
import GigDetailsPanel from '@/components/GigDetailsPanel'
import PersistentMap from '@/components/PersistentMap'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [selectedGigForDetails, setSelectedGigForDetails] = useState<Gig | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchGigs()
    }
  }, [status, router])

  const fetchGigs = async () => {
    try {
      const response = await fetch('/api/gigs')
      if (response.ok) {
        const data = await response.json()
        setGigs(data)
      }
    } catch (error) {
      console.error('Error fetching gigs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGig = async (data: CreateGigData) => {
    setIsFormLoading(true)
    try {
      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        const newGig = await response.json()
        setGigs(prev => [...prev, newGig])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating gig:', error)
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleUpdateGig = async (data: CreateGigData) => {
    if (!selectedGig) return
    
    setIsFormLoading(true)
    try {
      const response = await fetch(`/api/gigs/${selectedGig.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        const updatedGig = await response.json()
        setGigs(prev => prev.map(gig => gig.id === selectedGig.id ? updatedGig : gig))
        setShowForm(false)
        setSelectedGig(null)
      }
    } catch (error) {
      console.error('Error updating gig:', error)
    } finally {
      setIsFormLoading(false)
    }
  }


  const handleDateClick = (date: Date) => {
    setShowForm(true)
    setSelectedGig(null)
  }

  const handleGigClick = (gig: Gig) => {
    setSelectedGigForDetails(gig)
  }

  const handleGigEdit = (gig: Gig) => {
    setSelectedGig(gig)
    setShowForm(true)
  }

  const handleGigDelete = async (gigId: string) => {
    try {
      const response = await fetch(`/api/gigs/${gigId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setGigs(prev => prev.filter(gig => gig.id !== gigId))
        setSelectedGigForDetails(null)
      }
    } catch (error) {
      console.error('Error deleting gig:', error)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setSelectedGig(null)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">BandLink</h1>
              {/* <p className="text-gray-600"> {session.user?.name}!</p> */}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add New Gig
              </button>
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-7 gap-6 h-[calc(100vh-200px)]">
          {/* Left Column - Calendar and Gig Details */}
          <div className="xl:col-span-2 space-y-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow">
              <Calendar
                gigs={gigs}
                onDateClick={handleDateClick}
                onGigClick={handleGigClick}
              />
            </div>
            
            <GigDetailsPanel
              gig={selectedGigForDetails}
              onEdit={handleGigEdit}
              onDelete={handleGigDelete}
            />

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-medium text-gray-900 mb-3">Stats</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{gigs.length}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {gigs.filter(gig => {
                      const gigDate = new Date(gig.date)
                      const now = new Date()
                      return gigDate.getMonth() === now.getMonth() && gigDate.getFullYear() === now.getFullYear()
                    }).length}
                  </div>
                  <div className="text-xs text-gray-600">This Month</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    ${gigs.length > 0 ? Math.round(gigs.reduce((sum, gig) => sum + gig.pricePerHour, 0) / gigs.length) : 0}
                  </div>
                  <div className="text-xs text-gray-600">Avg/hr</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Persistent Map */}
          <div className="xl:col-span-5">
            <PersistentMap
              selectedGig={selectedGigForDetails}
              gigs={gigs}
              className="h-full"
            />
          </div>
        </div>
      </main>

      {showForm && (
        <GigForm
          gig={selectedGig}
          onSubmit={selectedGig ? handleUpdateGig : handleCreateGig}
          onCancel={handleFormCancel}
          isLoading={isFormLoading}
        />
      )}
    </div>
  )
}