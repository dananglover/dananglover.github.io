import { Button } from '@/components/ui/button';
import { BookOpen, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-pink-500 to-teal-500 py-20">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Discover the Heart of{' '}
          <span className="text-yellow-300">Danang</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          A community for Danang lovers — share your favorite places, discover hidden gems, 
          and connect through stories that celebrate this beautiful city.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/places">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-8 w-full sm:w-auto">
              <MapPin className="h-5 w-5 mr-2" />
              Explore Places
            </Button>
          </Link>
          <Link to="/blog">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-8 w-full sm:w-auto">
              <BookOpen className="h-5 w-5 mr-2" />
              Read Stories
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Discover Places</h3>
            <p className="text-white/80">Find the best coffee shops, restaurants, and check-in spots</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Share Stories</h3>
            <p className="text-white/80">Write about your experiences and connect with others</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Build Community</h3>
            <p className="text-white/80">Review, favorite, and recommend to fellow Danang lovers</p>
          </div>
        </div>
      </div>
    </div>
  );
};
