# MetaCore Life

A modern full-stack social platform focused on improving people's Health, Wealth, and Relationships through challenges, progress tracking, social posting, and a built-in marketplace.

## 🌟 Features

### Core Features

- **Authentication System**
  - Email/password authentication
  - OAuth with Google and Apple
  - Secure session management with Supabase

- **Challenges System**
  - Browse challenges by category (Health, Wealth, Relationships)
  - Join 7-30 day challenges
  - Daily check-ins with text, photo, or video
  - Streak tracking
  - Automatic completion celebration
  - Progress visualization

- **Social Feed**
  - Home feed showing posts from followed users
  - Like and comment functionality
  - Challenge completion posts with shareable cards
  - Discover feed for trending content

- **User Profiles**
  - Customizable profiles with bio and avatar
  - Active and completed challenges display
  - Followers/Following system
  - Badges and achievements
  - Streak tracking

- **Marketplace**
  - Product grid with categories
  - Search functionality
  - Product detail pages
  - Affiliate links to external stores
  - Click tracking

- **Notifications**
  - Daily challenge reminders
  - Social interactions (likes, comments, follows)
  - Challenge milestones
  - Trending challenge alerts

- **Waitlist System**
  - Email collection landing page
  - Automatic welcome emails
  - Database storage

- **Admin Dashboard**
  - Create and manage challenges
  - Upload and manage products
  - View analytics (signups, active users, completion rates)
  - Moderate posts

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage (configured in upload route)
- **Package Manager**: pnpm
- **Monorepo**: Turborepo

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Supabase account and project

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd metacorelife2
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Run the database migration:

```bash
# If using Supabase CLI locally
supabase db push

# Or manually run the migration file:
# supabase/migrations/20240101000000_initial_schema.sql
```

### 4. Configure Environment Variables

Create a `.env.local` file in `apps/web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Set Up Supabase Storage (for file uploads)

1. In your Supabase dashboard, go to Storage
2. Create a new bucket called `uploads`
3. Set it to public or configure RLS policies as needed

### 6. Configure OAuth Providers (Optional)

In your Supabase dashboard:
1. Go to Authentication > Providers
2. Enable Google and/or Apple OAuth
3. Add your OAuth credentials

### 7. Run the Development Server

```bash
# From root
pnpm dev

# Or specifically for web app
pnpm web:dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
metacorelife2/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── app/            # App router pages
│   │   │   ├── (auth)/     # Authentication pages
│   │   │   ├── (public)/   # Public pages
│   │   │   ├── app/        # Protected app pages
│   │   │   ├── admin/      # Admin dashboard
│   │   │   ├── api/        # API routes
│   │   │   └── shop/       # Marketplace pages
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities and Supabase clients
│   └── mobile/            # Mobile app (React Native)
├── packages/               # Shared packages
│   ├── types/             # TypeScript types
│   ├── ui/                # Shared UI components
│   └── utils/             # Shared utilities
├── supabase/
│   └── migrations/        # Database migrations
└── package.json
```

## 🗄️ Database Schema

The database includes the following main tables:

- `profiles` - User profiles
- `challenges` - Challenge definitions
- `user_challenges` - User challenge progress
- `challenge_check_ins` - Daily check-ins
- `posts` - Social feed posts
- `post_likes` - Post likes
- `post_comments` - Post comments
- `follows` - User follow relationships
- `products` - Marketplace products
- `notifications` - User notifications
- `badges` - Achievement badges
- `user_badges` - User badge assignments
- `waitlist` - Email waitlist

See `supabase/migrations/20240101000000_initial_schema.sql` for the complete schema.

## 🔐 Authentication

The app uses Supabase Auth with:

- Email/password authentication
- OAuth providers (Google, Apple)
- Row Level Security (RLS) policies for data protection
- Automatic profile creation on signup

## 📝 API Routes

Key API endpoints:

- `/api/waitlist` - Join waitlist
- `/api/challenges/join` - Join a challenge
- `/api/challenges/check-in` - Submit daily check-in
- `/api/challenges/create` - Create new challenge (admin)
- `/api/posts/[id]/like` - Like/unlike a post
- `/api/profile/[id]/follow` - Follow/unfollow a user
- `/api/upload` - Upload media files

## 🎨 UI Components

The app uses a custom component library built on Radix UI:

- Button, Input, Card
- Avatar, Toast
- And more in `apps/web/components/ui/`

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Deploy Supabase

1. Use Supabase cloud hosting
2. Or self-host using Supabase CLI

## 📧 Email Setup (Optional)

To enable welcome emails for waitlist signups:

1. Set up Resend or similar email service
2. Add API key to environment variables
3. Update `/api/waitlist/route.ts` to send emails

## 🔧 Development

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

### Building

```bash
pnpm build
```

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📞 Support

[Add support information here]

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Video upload support
- [ ] Challenge templates
- [ ] Social sharing features

---

Built with ❤️ for improving Health, Wealth, and Relationships

