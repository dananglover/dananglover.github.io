
import { useState, useEffect } from 'react';
import { Place } from '@/types';
import { placeService } from '@/services/PlaceService';

export const usePlaces = (page = 1, limit = 12, placeTypeId?: string) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await placeService.getPlaces(page, limit, placeTypeId);
        setPlaces(response.data);
        setPagination(response.pagination);
        setError(null);
      } catch (err) {
        setError('Failed to fetch places');
        console.error('Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [page, limit, placeTypeId]);

  return {
    places,
    pagination,
    loading,
    error,
    refetch: () => {
      const fetchPlaces = async () => {
        try {
          setLoading(true);
          const response = await placeService.getPlaces(page, limit, placeTypeId);
          setPlaces(response.data);
          setPagination(response.pagination);
          setError(null);
        } catch (err) {
          setError('Failed to fetch places');
          console.error('Error fetching places:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPlaces();
    }
  };
};

export const usePlace = (id: string) => {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const response = await placeService.getPlaceById(id);
        setPlace(response);
        setError(null);
      } catch (err) {
        setError('Failed to fetch place');
        console.error('Error fetching place:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlace();
    }
  }, [id]);

  return { place, loading, error };
};
