
import { Navigation } from '@/components/layout/Navigation';
import { ReviewSection } from '@/components/places/ReviewSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { placeService } from '@/services/PlaceService';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, DollarSign, Edit, Heart, MapPin, Star } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PlaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: place, isLoading, error } = useQuery({
    queryKey: ['place', id],
    queryFn: () => placeService.getPlaceById(id!),
    enabled: !!id
  });

  const handleEditPlace = () => {
    navigate(`/places/${id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Place Not Found</h1>
            <p className="text-gray-600 mb-8">The place you're looking for doesn't exist.</p>
            <Link to="/places">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Places
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && place.userId === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link to="/places" className="inline-flex items-center text-orange-600 hover:text-orange-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Places
            </Link>
            
            {isOwner && (
              <Button
                onClick={handleEditPlace}
                variant="outline"
                className="bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Place
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="relative mb-6">
                <img
                  src={place.photos?.[0] || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop"}
                  alt={place.name}
                  className="w-full rounded-lg object-cover h-64 lg:h-96"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {place.photos && place.photos.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {place.photos.slice(1, 4).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${place.name} ${index + 2}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  {place.placeType?.name || 'Place'}
                </Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{place.rating}</span>
                  <span className="text-gray-500 ml-1">({place.reviewsCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{place.name}</h1>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{place.location}</span>
              </div>

              <div className="flex items-center text-green-600 mb-6">
                <DollarSign className="h-5 w-5 mr-2" />
                <span className="font-semibold">{place.price}</span>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">About this place</h3>
                  <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: place.description }} />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <ReviewSection placeId={place.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
