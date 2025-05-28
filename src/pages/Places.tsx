import { Navigation } from '@/components/layout/Navigation';
import { PlaceCard } from '@/components/places/PlaceCard';
import { PlaceFilters } from '@/components/places/PlaceFilters';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { placeService } from '@/services/PlaceService';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Places = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('');
  const { user } = useAuth();

  const { data: placesData, isLoading } = useQuery({
    queryKey: ['places', currentPage, selectedType],
    queryFn: () => placeService.getPlaces(currentPage, 12, selectedType || undefined)
  });

  const { data: placeTypes } = useQuery({
    queryKey: ['placeTypes'],
    queryFn: () => placeService.getPlaceTypes()
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Places</h1>
            <p className="text-gray-600 mt-2">Discover amazing spots in Danang</p>
          </div>
          
          {user && (
            <Link to="/places/create">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Place
              </Button>
            </Link>
          )}
        </div>

        <PlaceFilters
          placeTypes={placeTypes || []}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {placesData?.data.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>

            {placesData?.data.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No places found. Be the first to add one!</p>
              </div>
            )}

            {placesData && placesData.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: placesData.pagination.totalPages }, (_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Places; 