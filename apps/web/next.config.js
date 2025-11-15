/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@metacorelife/ui', '@metacorelife/types', '@metacorelife/utils'],
  images: {
    domains: ['images.unsplash.com', 'your-supabase-project.supabase.co'],
  },
}

module.exports = nextConfig