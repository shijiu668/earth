'use client';

import { useState } from 'react';
import { Menu, X, Globe, User, LogIn } from 'lucide-react';
import { useAuth } from './AuthProvider'; // 引入 useAuth
import LoginModal from './LoginModal'; // 引入 LoginModal

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, profile, signOut } = useAuth(); // 使用 AuthContext

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold gradient-text">
                AI Earth Zoom Out
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/pricing" className="text-gray-300 hover:text-white transition-colors duration-200">
                Pricing
              </a>
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-white">
                    Credits: {profile?.credits ?? '...'}
                  </div>
                  <button onClick={signOut} className="btn-secondary">
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowLoginModal(true)} className="btn-primary">
                  Login
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#home"
                  className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  href="#generator"
                  className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Generator
                </a>
                <a
                  href="#showcase"
                  className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Showcase
                </a>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-white transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
                <button className="btn-primary mt-4">
                  Get Started
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}