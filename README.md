<<<<<<< HEAD
# Tinylink
=======
# URL Shortener

A complete Bit.ly-style URL shortener built with Next.js, Tailwind CSS, and Supabase (Postgres).

## Features

- Create short links with auto-generated or custom codes
- Validate URLs and ensure unique custom codes
- Click tracking with last clicked timestamp
- Search and filter links
- Copy short URLs to clipboard
- Detailed statistics page for each link
- Responsive, polished UI with Tailwind CSS
- Health check endpoint
- RESTful API endpoints

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (Postgres)
- **Language**: TypeScript
- **Deployment**: Vercel + Supabase

## Database Schema

The application uses a single `links` table with the following structure:

```sql
links (
  id uuid PRIMARY KEY,
  code text NOT NULL,
  target_url text NOT NULL,
  click_count integer DEFAULT 0,
  last_clicked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false
)
```

## API Endpoints

### Create Short Link
```http
POST /api/links
Content-Type: application/json

{
  "target_url": "https://example.com/very/long/url",
  "code": "mycode" // optional, 6-8 alphanumeric characters
}

Response: 201 Created
{
  "id": "uuid",
  "code": "abc123",
  "target_url": "https://example.com/very/long/url",
  "click_count": 0,
  "last_clicked_at": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "is_deleted": false
}

Response: 409 Conflict (if custom code already exists)
{
  "error": "Code already exists"
}

Response: 400 Bad Request (invalid URL or code format)
{
  "error": "Invalid URL format"
}
```

### Get All Links
```http
GET /api/links

Response: 200 OK
[
  {
    "id": "uuid",
    "code": "abc123",
    "target_url": "https://example.com",
    "click_count": 42,
    "last_clicked_at": "2024-01-01T12:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z",
    "is_deleted": false
  }
]
```

### Get Link by Code
```http
GET /api/links/:code

Response: 200 OK
{
  "id": "uuid",
  "code": "abc123",
  "target_url": "https://example.com",
  "click_count": 42,
  "last_clicked_at": "2024-01-01T12:00:00.000Z",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z",
  "is_deleted": false
}

Response: 404 Not Found
{
  "error": "Link not found"
}
```

### Delete Link
```http
DELETE /api/links/:code

Response: 200 OK
{
  "success": true
}

Response: 404 Not Found
{
  "error": "Link not found"
}
```

### Redirect Route
```http
GET /:code

Response: 302 Redirect to target_url
(Increments click_count and updates last_clicked_at)

Response: 404 Not Found (if link doesn't exist or is deleted)
```

### Health Check
```http
GET /healthz

Response: 200 OK
{
  "ok": true,
  "version": "1.0"
}
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd url-shortener
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. The database migration has already been applied
3. Copy your Supabase URL and anon key from the project settings

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BASE_URL=http://localhost:3000
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 6. Build for production

```bash
npm run build
npm run start
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `BASE_URL` (set to your production URL)
4. Deploy

The application is configured with `vercel.json` for optimal deployment.

### Supabase Configuration

The Supabase database is already configured with:
- Row Level Security (RLS) enabled
- Policies for anonymous access (suitable for a public URL shortener)
- Unique index on `code` for non-deleted links
- Indexes for performance optimization

## Pages

### Dashboard (/)
- Create new short links with optional custom codes
- View all links with click counts and timestamps
- Search and filter links
- Copy short URLs to clipboard
- Delete links
- Navigate to detailed stats

### Stats Page (/code/:code)
- View detailed information about a specific link
- See total clicks, creation date, and last clicked timestamp
- Copy short URL
- Test the redirect

## Code Validation

- Custom codes must be 6-8 alphanumeric characters `[A-Za-z0-9]{6,8}`
- Auto-generated codes are 6 characters long
- URLs must be valid HTTP/HTTPS URLs
- Custom codes are checked for uniqueness (returns 409 if exists)

## Security

- Row Level Security (RLS) enabled on all tables
- Input validation on all API endpoints
- URL validation to prevent malicious links
- Soft delete implementation (data is never actually removed)

## License

MIT
>>>>>>> 0e638ae (first commit)
