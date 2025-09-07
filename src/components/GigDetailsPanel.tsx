'use client'

import { Gig } from '@/types'
import { format } from 'date-fns'
import { openMapsForDirections } from '@/utils/routing'

interface GigDetailsPanelProps {
  gig: Gig | null
  onEdit: (gig: Gig) => void
  onDelete: (gigId: string) => void
}

export default function GigDetailsPanel({ gig, onEdit, onDelete }: GigDetailsPanelProps) {
  if (!gig) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-fit">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Gig</h3>
          <p className="text-sm">Click on a gig in the calendar to view details and location</p>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this gig?')) {
      onDelete(gig.id)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 h-fit">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">{gig.title}</h3>
          <p className="text-xs text-gray-500">
            {format(new Date(gig.date), 'MMM d, yyyy • h:mm a')}
          </p>
        </div>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onEdit(gig)}
            className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-50"
          >
            Del
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-xs font-medium text-gray-600">Location:</span>
          <p className="text-xs text-gray-900 break-words">{gig.location}</p>
          {(gig.latitude && gig.longitude) && (
            <button
              onClick={() => openMapsForDirections(undefined, undefined, gig.latitude!, gig.longitude!, gig.location)}
              className="mt-1 text-xs text-blue-500 hover:text-blue-700 inline-flex items-center gap-1"
            >
              🗺️ Directions
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium text-gray-600">Rate:</span>
            <p className="text-green-600 font-medium">${gig.pricePerHour}/hr</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Contact:</span>
            <p className="text-gray-900 truncate">{gig.contactPhone}</p>
          </div>
        </div>

        {gig.notes && (
          <div>
            <span className="text-xs font-medium text-gray-600">Notes:</span>
            <p className="text-xs text-gray-900 line-clamp-3">{gig.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}