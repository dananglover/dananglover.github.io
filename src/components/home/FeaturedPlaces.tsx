
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Heart, DollarSign } from 'lucide-react';

const mockPlaces = [
  {
    id: 1,
    name: "Cong Caphe Dragon Bridge",
    description: "Iconic Vietnamese coffee chain with a view of the famous Dragon Bridge",
    price: "50,000-80,000 VND",
    placeType: "Coffee Shop",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
    location: "Dragon Bridge, Danang"
  },
  {
    id: 2,
    name: "Madame Lân Restaurant",
    description: "Authentic Vietnamese cuisine in a beautiful colonial setting",
    price: "200,000-400,000 VND",
    placeType: "Restaurant",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555992336-03a23c0c3be6?w=400&h=300&fit=crop",
    location: "Hội An Ancient Town"
  },
  {
    id: 3,
    name: "Ba Na Hills",
    description: "Golden Bridge and French Village in the mountains",
    price: "700,000 VND",
    placeType: "Checkin",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    location: "Ba Na Hills, Danang"
  }
];

export const FeaturedPlaces = () => {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Featured Places
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the most loved spots by our community of Danang enthusiasts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockPlaces.map((place) => (
          <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img 
                src={place.image} 
                alt={place.name}
                className="w-full h-48 object-cover"
              />
              <Button 
                size="sm" 
                variant="secondary"
                className="absolute top-3 right-3 bg-white/90 hover:bg-white"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Badge 
                variant="secondary" 
                className="absolute top-3 left-3 bg-orange-500 text-white hover:bg-orange-600"
              >
                {place.placeType}
              </Badge>
            </div>
            
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{place.name}</h3>
              <p className="text-gray-600 mb-4">{place.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {place.location}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  {place.rating}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">{place.price}</span>
              </div>
            </CardContent>
            
            <CardFooter className="px-6 pb-6">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" size="lg" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
          Explore All Places
        </Button>
      </div>
    </section>
  );
};
