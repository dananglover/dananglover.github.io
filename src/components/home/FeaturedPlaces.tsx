
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Heart, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { placeService } from '@/services/PlaceService';

export const FeaturedPlaces = () => {
  const { data: placesData, isLoading } = useQuery({
    queryKey: ['featured-places'],
    queryFn: () => placeService.getPlaces(1, 3)
  });

  if (isLoading) {
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
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const places = placesData?.data || [];

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
        {places.map((place) => (
          <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img 
                src={place.photos?.[0] || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop"} 
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
                {place.placeType?.name || 'Place'}
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
              <Link to={`/places/${place.id}`} className="w-full">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/places">
          <Button variant="outline" size="lg" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
            Explore All Places
          </Button>
        </Link>
      </div>
    </section>
  );
};
