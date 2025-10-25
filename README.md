# BlogHub - Multi-User Blogging Platform

A modern, type-safe blogging platform built with Next.js 15, tRPC, Drizzle ORM, and PostgreSQL. This project demonstrates full-stack development best practices with end-to-end type safety.

🔗 **Live Demo**: https://multi-user-blogging-platform-orpin.vercel.app/

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **API Layer**: tRPC
- **Validation**: Zod
- **State Management**: React Query (via tRPC) + Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Markdown**: react-markdown + remark-gfm

## ✨ Features Implemented

### 🔴 Priority 1 (Must Have) - ✅ Complete

- [x] Blog post CRUD operations (create, read, update, delete)
- [x] Category CRUD operations
- [x] Assign multiple categories to posts
- [x] Blog listing page showing all posts
- [x] Individual post view page with markdown rendering
- [x] Category filtering on listing page
- [x] Basic responsive navigation
- [x] Clean, professional UI

### 🟡 Priority 2 (Should Have) - ✅ Complete

- [x] Landing page with 3+ sections (Hero, Features, Footer)
- [x] Dashboard page for managing posts
- [x] Draft vs Published post status
- [x] Loading and error states
- [x] Mobile-responsive design
- [x] Markdown editor with live preview

### 🟢 Priority 3 (Nice to Have) - Not Implemented

Time was prioritized on core features and code quality. The following features were not implemented:
- [ ] Search functionality for posts
- [ ] Post statistics (word count, reading time)
- [ ] Dark mode support
- [ ] Image upload for posts
- [ ] SEO meta tags
- [ ] Pagination

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/trpc/[trpc]/         # tRPC API route handler
│   ├── blog/                    # Blog pages
│   │   ├── [slug]/             # Individual post page
│   │   └── page.tsx            # Blog listing page
│   ├── categories/              # Category management
│   ├── dashboard/               # Post management dashboard
│   │   ├── edit/[id]/          # Edit post page
│   │   └── new/                # Create new post page
│   ├── layout.tsx              # Root layout with tRPC provider
│   └── page.tsx                # Landing page
├── components/
│   ├── navigation.tsx          # Navigation component
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── db/
│   │   ├── client.ts           # Drizzle client
│   │   ├── schema.ts           # Database schema
│   │   └── seed.ts             # Seed script
│   ├── trpc/
│   │   ├── client.ts           # tRPC client
│   │   ├── context.ts          # tRPC context
│   │   ├── init.ts             # tRPC initialization
│   │   ├── Provider.tsx        # tRPC React provider
│   │   ├── root.ts             # Root router
│   │   └── routers/
│   │       ├── posts.ts        # Posts router
│   │       └── categories.ts   # Categories router
│   └── utils/
│       └── slugify.ts          # Slug generation utility
└── drizzle.config.ts           # Drizzle configuration
```

## 🔌 tRPC Router Structure

### Posts Router (`lib/trpc/routers/posts.ts`)

**Procedures:**
- `create` - Create a new post with title, content, status, and categories
- `list` - List posts with optional filtering by status and category
- `getBySlug` - Get a single post by slug (includes categories)
- `getById` - Get a single post by ID (for editing)
- `update` - Update an existing post
- `delete` - Delete a post

**Input Validation:**
All procedures use Zod schemas for runtime validation:
- Title: 1-200 characters
- Content: Required markdown string
- Slug: Auto-generated from title if not provided
- Status: Enum ('draft' | 'published')
- Category IDs: Array of valid UUIDs

### Categories Router (`lib/trpc/routers/categories.ts`)

**Procedures:**
- `create` - Create a new category
- `list` - List all categories
- `getById` - Get a single category by ID
- `getBySlug` - Get a single category by slug
- `update` - Update an existing category
- `delete` - Delete a category

**Features:**
- Automatic slug generation from category name
- Unique slug validation
- Cascade deletion of post-category relationships

## 🗄️ Database Schema

### Tables

**posts**
- `id` - UUID primary key
- `title` - Text, required
- `content` - Text (markdown), required
- `slug` - Text, unique, required
- `status` - Enum ('draft' | 'published'), default 'draft'
- `created_at` - Timestamp, auto-generated
- `updated_at` - Timestamp, auto-updated

**categories**
- `id` - UUID primary key
- `name` - Text, required
- `description` - Text, optional
- `slug` - Text, unique, required
- `created_at` - Timestamp, auto-generated

**post_categories** (join table)
- `post_id` - UUID, foreign key to posts
- `category_id` - UUID, foreign key to categories
- Composite primary key (post_id, category_id)
- Cascade deletion enabled

### Row Level Security

All tables have RLS enabled with permissive policies for the MVP. In production, these should be restricted based on authentication.

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. **Seed the database**

The migration is automatically applied via Supabase MCP. To seed sample data:

```bash
npm run db:seed
```

This will create:
- 4 sample categories (Technology, Travel, Food, Lifestyle)
- 5 sample blog posts (4 published, 1 draft)
- Post-category relationships

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

### Creating a Post

1. Navigate to the Dashboard (`/dashboard`)
2. Click "New Post"
3. Enter title and content (markdown supported)
4. Select categories (optional)
5. Choose to save as draft or publish immediately
6. Click "Save Post"

### Editing a Post

1. Go to Dashboard
2. Click "Edit" on any post
3. Modify the content
4. Update status if needed
5. Click "Update Post"

### Managing Categories

1. Navigate to Categories (`/categories`)
2. Click "New Category"
3. Enter name and description
4. Categories are automatically assigned slugs

### Viewing Published Posts

1. Go to Blog (`/blog`)
2. Use the category filter to narrow results
3. Click "Read More" to view full posts

## 🧪 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Type check with TypeScript
npm run db:seed      # Seed database with sample data
```

## 🎯 Key Implementation Decisions

### Why tRPC?

tRPC provides end-to-end type safety without code generation. Changes to the backend API are immediately reflected in the frontend with TypeScript errors, reducing bugs and improving developer experience.

### Why Drizzle ORM?

Drizzle is lightweight, type-safe, and provides an SQL-like query builder. It offers better performance than traditional ORMs while maintaining type safety.

### Why Markdown?

Markdown provides a simple, distraction-free writing experience. It's familiar to developers and can be easily extended. This saved 2-3 hours compared to implementing a rich text editor.

### Architecture Patterns

- **Server-side operations**: All database operations happen server-side through tRPC
- **Client-side caching**: React Query automatically caches API responses
- **Optimistic updates**: Immediate UI feedback with automatic rollback on errors
- **Validation layer**: Zod schemas ensure data integrity at runtime

## ⚡ Performance Considerations

- Server-side rendering for SEO and initial page load
- Automatic code splitting with Next.js App Router
- React Query caching reduces unnecessary API calls
- Indexes on frequently queried columns (slug, status)

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Input validation with Zod schemas
- SQL injection prevention via parameterized queries (Drizzle)
- XSS protection via React's automatic escaping

**Note**: Authentication is not implemented for this MVP. In production, RLS policies should be updated to check user authentication.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
DATABASE_URL=your-production-database-url
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📊 Feature Checklist

✅ **Backend (100%)**
- ✅ PostgreSQL database setup
- ✅ Drizzle ORM schema
- ✅ tRPC API layer
- ✅ Posts CRUD with validation
- ✅ Categories CRUD with validation
- ✅ Slug generation
- ✅ Many-to-many relationships

✅ **Frontend (100%)**
- ✅ Landing page
- ✅ Blog listing with filters
- ✅ Individual post pages
- ✅ Dashboard for post management
- ✅ Create/Edit post forms
- ✅ Category management
- ✅ Markdown editor with preview
- ✅ Loading states
- ✅ Error handling
- ✅ Mobile responsive

## 🎓 What I Learned

- tRPC's type inference significantly improves developer experience
- Drizzle ORM provides a good balance between type safety and SQL control
- Next.js 13+ App Router with server components requires careful consideration of client/server boundaries
- shadcn/ui accelerates UI development significantly

## 📈 Future Enhancements

If more time were available:
1. Full-text search with PostgreSQL
2. Image upload with storage service
3. User authentication and authorization
4. Comments system
5. Post analytics and views counter
6. RSS feed
7. SEO optimization
8. Social media sharing
9. Email notifications

## 📄 License

MIT

## 👨‍💻 Author

Built as a technical assessment demonstrating full-stack development skills with modern tools.

---

**Time Spent**: Approximately 12-14 hours

**Trade-offs Made**:
- Used markdown instead of rich text editor (saved 2-3 hours)
- Used shadcn/ui components (saved 3-4 hours)
- Focused on core features over bonus features
- Minimal custom styling to prioritize functionality
- No authentication system (as specified in requirements)
