export interface Band {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Gig {
  id: string
  title: string
  date: Date
  location: string
  latitude?: number
  longitude?: number
  pricePerHour: number
  contactPhone: string
  notes?: string
  bandId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateGigData {
  title: string
  date: string
  location: string
  latitude?: number
  longitude?: number
  pricePerHour: number
  contactPhone: string
  notes?: string
}

export interface UpdateGigData extends Partial<CreateGigData> {
  id: string
}