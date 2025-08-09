'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export default function UnifiedHeader({ breadcrumbs = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Determine active page based on pathname
  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Breadcrumbs */}
          <div className="flex items-center">
            <div 
              onClick={() => router.push('/')}
              className="flex items-center gap-3 cursor-pointer hover:-translate-y-0.5 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center overflow-hidden">
                <Image
                  src="/readtention-logo-v2.png"
                  alt="Readtention Logo"
                  width={36}
                  height={36}
                  className="scale-100"
                />
              </div>
              <span className="text-xl font-bold text-gray-700">
                readtention
              </span>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <nav className="hidden md:flex items-center ml-8">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                    {crumb.href ? (
                      <a
                        onClick={() => router.push(crumb.href)}
                        className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-900 font-medium">
                        {crumb.label}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a 
              onClick={() => router.push('/books')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                isActive('/books') 
                  ? 'text-purple-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Books
            </a>
            <a 
              onClick={() => router.push('/trends')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                isActive('/trends') 
                  ? 'text-purple-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trends
            </a>
            <a 
              onClick={() => router.push('/ai-agent')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                isActive('/ai-agent') 
                  ? 'text-purple-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              AI Agent
            </a>
            <button className="text-sm font-medium text-purple-700 border border-purple-700 rounded-lg px-4 py-2 hover:bg-purple-700 hover:text-white transition-colors">
              Sign In
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <a
                onClick={() => { toggleMenu(); router.push('/books'); }}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive('/books')
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                My Books
              </a>
              <a
                onClick={() => { toggleMenu(); router.push('/trends'); }}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive('/trends')
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Trends
              </a>
              <a
                onClick={() => { toggleMenu(); router.push('/ai-agent'); }}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive('/ai-agent')
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                AI Agent
              </a>
              <button 
                onClick={toggleMenu}
                className="text-sm font-medium text-purple-700 border border-purple-700 rounded-lg px-4 py-2 hover:bg-purple-700 hover:text-white transition-colors mx-4"
              >
                Sign In
              </button>
            </div>

            {/* Mobile Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 px-4">
                <div className="flex items-center text-xs text-gray-600">
                  <span>You are here:</span>
                  {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="flex items-center">
                      <ChevronRight className="w-3 h-3 mx-1" />
                      <span className={index === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : ''}>
                        {crumb.label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}