
import { Place, CreatePlaceForm, Review, CreateReviewForm, PaginatedResponse } from '@/types';

export class PlaceService {
  async getPlaces(page = 1, limit = 12, placeTypeId?: string): Promise<PaginatedResponse<Place>> {
    // Mock implementation - replace with actual Supabase calls
    const mockPlaces: Place[] = [
      {
        id: '1',
        name: 'Cong Caphe Dragon Bridge',
        description: 'Iconic Vietnamese coffee chain with a view of the famous Dragon Bridge',
        price: '50,000-80,000 VND',
        photos: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop'],
        placeTypeId: 'coffee-shop',
        location: 'Dragon Bridge, Danang',
        rating: 4.5,
        reviewsCount: 23,
        userId: 'user1',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ];

    return {
      data: mockPlaces,
      pagination: {
        page,
        limit,
        total: mockPlaces.length,
        totalPages: Math.ceil(mockPlaces.length / limit)
      }
    };
  }

  async getPlaceById(id: string): Promise<Place | null> {
    // Mock implementation
    return {
      id,
      name: 'Cong Caphe Dragon Bridge',
      description: 'Iconic Vietnamese coffee chain with a view of the famous Dragon Bridge',
      price: '50,000-80,000 VND',
      photos: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop'],
      placeTypeId: 'coffee-shop',
      location: 'Dragon Bridge, Danang',
      rating: 4.5,
      reviewsCount: 23,
      userId: 'user1',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    };
  }

  async createPlace(placeData: CreatePlaceForm): Promise<Place> {
    // Mock implementation - in real app, this would upload images and create place in Supabase
    console.log('Creating place:', placeData);
    
    const newPlace: Place = {
      id: `place-${Date.now()}`,
      name: placeData.name,
      description: placeData.description,
      price: placeData.price,
      photos: [], // Would be uploaded image URLs
      placeTypeId: placeData.placeTypeId,
      location: placeData.location,
      rating: 0,
      reviewsCount: 0,
      userId: 'current-user', // Would get from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return newPlace;
  }

  async getPlaceReviews(placeId: string): Promise<Review[]> {
    // Mock implementation
    return [];
  }

  async createReview(placeId: string, reviewData: CreateReviewForm): Promise<Review> {
    console.log('Creating review for place:', placeId, reviewData);
    
    return {
      id: `review-${Date.now()}`,
      placeId,
      userId: 'current-user',
      rating: reviewData.rating,
      content: reviewData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async toggleFavorite(placeId: string): Promise<boolean> {
    console.log('Toggling favorite for place:', placeId);
    return true; // Return new favorite status
  }

  async getFavorites(): Promise<Place[]> {
    return [];
  }
}

export const placeService = new PlaceService();
