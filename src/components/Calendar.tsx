'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns'
import { Gig } from '@/types'

interface CalendarProps {
  gigs: Gig[]
  onDateClick: (date: Date) => void
  onGigClick: (gig: Gig) => void
}

export default function Calendar({ gigs, onDateClick, onGigClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const dateFormat = "d"
  const rows = []
  let days = []
  let day = startDate
  let formattedDate = ""

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat)
      const cloneDay = day
      const dayGigs = gigs.filter(gig => 
        isSameDay(new Date(gig.date), day)
      )

      days.push(
        <div
          className={`min-h-[120px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
            !isSameMonth(day, monthStart) ? 'text-gray-400 bg-gray-50' : ''
          } ${isToday(day) ? 'bg-blue-50 border-blue-200' : ''}`}
          key={day.toString()}
          onClick={() => onDateClick(cloneDay)}
        >
          <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : ''}`}>
            {formattedDate}
          </span>
          <div className="mt-1">
            {dayGigs.map((gig) => (
              <div
                key={gig.id}
                className="text-xs bg-blue-100 text-blue-800 p-1 mb-1 rounded cursor-pointer hover:bg-blue-200"
                onClick={(e) => {
                  e.stopPropagation()
                  onGigClick(gig)
                }}
              >
                <div className="font-medium truncate">{gig.title}</div>
                <div className="text-blue-600">
                  {format(new Date(gig.date), 'HH:mm')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
      day = addDays(day, 1)
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    )
    days = []
  }

  const nextMonth = () => {
    setCurrentDate(addDays(currentDate, 30))
  }

  const prevMonth = () => {
    setCurrentDate(addDays(currentDate, -30))
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                view === 'month'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border-l-0 border ${
                view === 'week'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
          </div>
          <button
            onClick={prevMonth}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
      </div>

      <div className="bg-gray-200 text-sm">
        {rows}
      </div>
    </div>
  )
}