# REBALL UK - Football Community Platform

The ultimate football community platform built with Next.js 14, TypeScript, Supabase, and NextAuth.js.

## Tech Stack

- **Framework**: Next.js 14+ with TypeScript and App Router
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma with Supabase integration
- **Authentication**: NextAuth.js v5 with Google OAuth
- **Styling**: Tailwind CSS with custom black/white color palette
- **File Storage**: Supabase Storage
- **Fonts**: Permanent Marker and Poppins

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reball-uk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in the following variables in `.env.local`:
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string
   - `NEXTAUTH_URL`: Your application URL (http://localhost:3000 for development)
   - `NEXTAUTH_SECRET`: A random string for NextAuth.js encryption
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth.js routes
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/             # Authentication components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth.js configuration
│   ├── prisma.ts         # Prisma client
│   └── supabase.ts       # Supabase client
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
└── styles/               # Additional styles
```

## Features

- **Authentication**: Google OAuth integration with NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: Supabase Storage integration
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Modern UI**: Custom black/white color palette

## Customization

### Colors
The project uses a custom color palette defined in `tailwind.config.ts`:
- Primary colors: Black and white variations
- Secondary colors: Gray scale variations
- Accent colors: Black, white, and gray

### Fonts
- **Permanent Marker**: Used for headings and branding
- **Poppins**: Used for body text and UI elements

## Deployment

1. **Set up your production environment variables**
2. **Deploy to Vercel or your preferred platform**
3. **Run database migrations**
4. **Configure your domain and SSL**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
