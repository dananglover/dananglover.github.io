import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { placeService } from '@/services/PlaceService';
import { Place } from '@/types';
import { DollarSign, Heart, MapPin, Star } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthModal } from '../auth/AuthModal';

interface PlaceCardProps {
  place: Place;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onFavoriteChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the favorite button
    e.stopPropagation(); // Prevent event bubbling

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsLoading(true);
      const newFavoriteState = await placeService.toggleFavorite(place.id, user.id);
      setIsFavorite(newFavoriteState);
      onFavoriteChange?.(newFavoriteState);
      
      toast({
        title: newFavoriteState ? "Added to favorites" : "Removed from favorites",
        description: newFavoriteState 
          ? `${place.name} has been added to your favorites`
          : `${place.name} has been removed from your favorites`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update favorite status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Link to={`/places/${place.id}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <div className="aspect-video relative overflow-hidden">
            {place.photos.length > 0 ? (
              <img
                src={place.photos[0]}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
            )}
            
            {place.placeType && (
              <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
                {place.placeType.name}
              </Badge>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              onClick={handleFavoriteClick}
              disabled={isLoading}
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
              />
            </Button>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{place.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{place.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="line-clamp-1">{place.location}</span>
              </div>
              
              <div className="flex items-center text-gray-500">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>{place.price}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-4 pb-4 pt-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium">{place.rating.toFixed(1)}</span>
                <span className="ml-1 text-sm text-gray-500">({place.reviewsCount})</span>
              </div>
              
              {place.user && (
                <span className="text-xs text-gray-500">by {place.user.name}</span>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}; 