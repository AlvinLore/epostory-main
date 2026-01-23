import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-600 rounded-xl">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl text-gray-900">EpoStory</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Log In
            </Link>
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-emerald-700 text-white rounded-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Learn Environmental Stories Through Interactive Chapters
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              EpoStory makes environmental education engaging and interactive.
              Explore chapters about air pollution, climate change, and
              sustainability through immersive narratives and real-world
              applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button className="bg-green-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 w-full sm:w-auto justify-center h-auto text-base">
                  <span>Start Your Adventure</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <button className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-sky-200 to-emerald-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🌍</div>
                <p className="text-gray-700 font-semibold">
                  Explore Environmental Stories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EpoStory?
            </h2>
            <p className="text-lg text-gray-600">
              Engaging educational content designed for learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Interactive Chapters
              </h3>
              <p className="text-gray-600">
                Explore detailed chapters with illustrations, narratives, and
                real-world context about environmental topics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Knowledge Assessment
              </h3>
              <p className="text-gray-600">
                Take quizzes after each chapter to test your understanding and
                receive personalized feedback.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Monitor your learning journey with progress bars, achievements,
                and detailed statistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                number: 1,
                title: "Create Account",
                description: "Sign up and set up your profile",
              },
              {
                number: 2,
                title: "Choose Chapter",
                description: "Select from our library of topics",
              },
              {
                number: 3,
                title: "Learn & Explore",
                description: "Read immersive environmental stories",
              },
              {
                number: 4,
                title: "Take Quiz",
                description: "Test your knowledge and track progress",
              },
            ].map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Join thousands of students exploring environmental education through
            interactive stories.
          </p>
          <Link href="/login">
            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold h-auto">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="font-bold">EpoStory</span>
            </div>
            <p className="text-gray-400 text-sm">
              Making environmental education engaging
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Chapters
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 EpoStory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}