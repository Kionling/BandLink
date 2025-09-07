# BandLink - Gig Management for Bands

A comprehensive web application for bands to manage their gigs, bookings, and schedule. Built with Next.js, TypeScript, Tailwind CSS, Prisma, and NextAuth.js.

## Features

- **Calendar System**: View gigs in monthly/weekly calendar format
- **Gig Management**: Complete CRUD operations (Create, Read, Update, Delete) for gigs
- **Authentication**: Secure band login system with NextAuth.js
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Database Integration**: SQLite database with Prisma ORM
- **Seed Data**: Pre-populated test data for quick testing

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js for authentication
- **Database**: SQLite with Prisma ORM
- **UI Components**: Custom React components with Tailwind styling

## Project Structure

```
bandlink/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   └── gigs/          # Gig CRUD endpoints
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard page
│   ├── components/            # Reusable React components
│   │   ├── Calendar.tsx       # Calendar view component
│   │   ├── GigForm.tsx        # Gig creation/editing form
│   │   └── Providers.tsx      # Context providers
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # NextAuth configuration
│   │   └── prisma.ts          # Prisma client setup
│   └── types/                 # TypeScript type definitions
│       └── index.ts           # Application types
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seed script
├── types/
│   └── next-auth.d.ts         # NextAuth type extensions
└── Configuration files (package.json, tailwind.config.ts, etc.)
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd BandLink
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   ```bash
   npm run db:push
   ```

4. **Seed the database with test data**:
   ```bash
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser and navigate to**:
   ```
   http://localhost:3000
   ```

### Test Login Credentials

Use these credentials to test the application:

- **Email**: `rockers@example.com`
- **Password**: `password123`

OR

- **Email**: `bluesband@example.com`
- **Password**: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new band
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Gigs
- `GET /api/gigs` - Get all gigs for authenticated band
- `POST /api/gigs` - Create a new gig
- `GET /api/gigs/[id]` - Get specific gig details
- `PUT /api/gigs/[id]` - Update a gig
- `DELETE /api/gigs/[id]` - Delete a gig

## Database Schema

### Bands Table
- `id` (String, Primary Key)
- `name` (String) - Band name
- `email` (String, Unique) - Login email
- `password` (String) - Hashed password
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Gigs Table
- `id` (String, Primary Key)
- `title` (String) - Gig name/title
- `date` (DateTime) - Date and time of the gig
- `location` (String) - Venue or address
- `pricePerHour` (Float) - Payment rate
- `contactPhone` (String) - Contact number
- `notes` (String, Optional) - Additional notes
- `bandId` (String, Foreign Key) - Reference to bands table
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Key Components

### Calendar Component (`src/components/Calendar.tsx`)
- Monthly calendar view with gig display
- Interactive date clicking for quick gig creation
- Gig cards showing time, title, and basic info
- Navigation between months

### GigForm Component (`src/components/GigForm.tsx`)
- Modal-based form for creating/editing gigs
- Form validation and error handling
- All required fields: title, date/time, location, price, contact
- Optional notes field

### Dashboard Page (`src/app/page.tsx`)
- Main application interface
- Calendar integration
- Upcoming gigs sidebar
- Quick statistics
- Authentication protection

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:seed` - Seed database with test data

## Security Features

- Password hashing with bcryptjs
- JWT-based session management
- Protected API routes with authentication middleware
- User data isolation (bands can only see their own gigs)

## Environment Variables

The application uses the following environment variables (already set in `.env.local`):

```
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set up production database** (if using PostgreSQL instead of SQLite)

3. **Set environment variables** for production

4. **Deploy to your preferred platform** (Vercel, Netlify, etc.)

## Future Enhancements

Potential features to add:
- Google Maps integration for location display
- Email notifications for upcoming gigs
- Payment tracking and invoicing
- Band member management
- Equipment checklist for gigs
- Venue rating system
- Export gigs to calendar applications

## Support

For issues or questions, please refer to the codebase comments and documentation within each file.