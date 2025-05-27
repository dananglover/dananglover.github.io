
import React, { useState } from 'react';
import { Heart, Menu, X, MapPin, BookOpen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-teal-600 bg-clip-text text-transparent">
              Danang Lover
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/places" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
              <MapPin className="h-4 w-4" />
              <span>Places</span>
            </a>
            <a href="/blog" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </a>
            <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="/places" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                <MapPin className="h-4 w-4" />
                <span>Places</span>
              </a>
              <a href="/blog" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </a>
              <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white w-fit">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
