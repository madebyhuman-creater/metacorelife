import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag, Users, TrendingUp, Heart, Target, Zap, Shield, Clock, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="grid md:grid-columns-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">A Healthier Social Platform</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Social Media That <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">Builds</span> Your Life
              </h1>
              <p className="text-xl md:text-2xl text-purple-100">
                Stop wasting time scrolling. Start achieving your core goals in Health, Wealth & Relationships.
              </p>
              <p className="text-lg text-purple-200">
                Unlike Instagram, we help you <strong>achieve real progress</strong> instead of endless scrolling.
              </p>
              
              {/* Main CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/waitlist">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-purple-50 group">
                    Get Early Access
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    <Users className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Track Goals</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Join Challenges</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">Share Progress</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Animation */}
            <div className="relative h-[400px] md:h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl backdrop-blur-sm border border-white/10">
                {/* Placeholder for app screenshot or animation */}
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">📱</div>
                    <p className="text-purple-200">Coming Soon: Mobile App</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section - vs Instagram */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">MetaCore Life</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A social platform designed to help you achieve, not just consume
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Instagram Column */}
            <div className="p-8 rounded-2xl bg-gray-50 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Traditional Social Media</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Endless scrolling with no purpose</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Comparison and FOMO</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Time wasted, no progress</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Passive consumption</span>
                </li>
              </ul>
            </div>

            {/* MetaCore Life Column */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">MetaCore Life</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="text-green-500 mt-1 h-5 w-5 flex-shrink-0" />
                  <span><strong>Purpose-driven</strong> challenges and goals</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="text-green-500 mt-1 h-5 w-5 flex-shrink-0" />
                  <span><strong>Real progress</strong> tracking and achievements</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="text-green-500 mt-1 h-5 w-5 flex-shrink-0" />
                  <span><strong>Time well spent</strong> building your core life</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="text-green-500 mt-1 h-5 w-5 flex-shrink-0" />
                  <span><strong>Active achievement</strong> instead of passive scrolling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Achieve Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Core Goals</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete platform to track, achieve, and share your journey in all three pillars of life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Track Your Journey</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor progress across Health, Wealth, and Relationships with intuitive dashboards
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Join Challenges</h3>
              <p className="text-gray-600 leading-relaxed">
                Participate in 30-day challenges, build streaks, and achieve milestones together
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Share Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with friends, celebrate wins, and build accountability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">MetaCore Life</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to transform your life, not waste your time
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Join Challenges</h3>
              <p className="text-gray-600">Pick challenges in Health, Wealth, or Relationships that align with your goals</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Track Daily Progress</h3>
              <p className="text-gray-600">Complete daily tasks, check in, and build streaks to maintain momentum</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Share & Connect</h3>
              <p className="text-gray-600">Post your progress, celebrate wins, and connect with like-minded achievers</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">Achieve Your Core</h3>
              <p className="text-gray-600">Build real habits, see real results, and master the three pillars of life</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Stop Scrolling. Start Achieving.</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Core Life?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Join a community focused on real achievement, not endless consumption. Transform your Health, Wealth, and Relationships today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Goals Achieved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Active Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">Premium</div>
              <div className="text-gray-600">Curated Products</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}