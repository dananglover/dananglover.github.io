
import { placeRepository } from '@/repositories/PlaceRepository';
import { CreatePlaceForm, CreateReviewForm, PaginatedResponse, Place, PlaceType, Review } from '@/types';

export class PlaceService {
  constructor(private repository = placeRepository) {}

  async getPlaces(page = 1, limit = 12, placeTypeId?: string): Promise<PaginatedResponse<Place>> {
    return this.repository.getPlaces(page, limit, placeTypeId);
  }

  async getPlaceById(id: string): Promise<Place | null> {
    return this.repository.getPlaceById(id);
  }

  async createPlace(placeData: CreatePlaceForm, userId: string): Promise<Place> {
    try {
      // Validate required fields
      if (!placeData.name || !placeData.description || !placeData.price || !placeData.placeTypeId || !placeData.location) {
        throw new Error('All fields are required');
      }

      // Validate photos
      if (!placeData.photos || placeData.photos.length === 0) {
        throw new Error('At least one photo is required');
      }

      // Validate photo sizes (max 10MB each)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      for (const photo of placeData.photos) {
        if (photo.size > MAX_FILE_SIZE) {
          throw new Error(`Photo ${photo.name} is too large. Maximum size is 10MB`);
        }
      }

      console.log('Creating place with service...', {
        name: placeData.name,
        photoCount: placeData.photos.length,
        userId
      });

      const place = await this.repository.createPlace(placeData, userId);
      console.log('Place created successfully in service');
      return place;
    } catch (error) {
      console.error('Error in PlaceService.createPlace:', error);
      throw error; // Re-throw to be handled by the UI layer
    }
  }

  async updatePlace(id: string, placeData: Partial<CreatePlaceForm>, userId: string): Promise<Place> {
    return this.repository.updatePlace(id, placeData, userId);
  }

  async deletePlace(id: string, userId: string): Promise<void> {
    return this.repository.deletePlace(id, userId);
  }

  async getPlaceReviews(placeId: string): Promise<Review[]> {
    return this.repository.getPlaceReviews(placeId);
  }

  async createReview(placeId: string, reviewData: CreateReviewForm, userId: string): Promise<Review> {
    return this.repository.createReview(placeId, reviewData, userId);
  }

  async deleteReview(id: string, userId: string): Promise<void> {
    return this.repository.deleteReview(id, userId);
  }

  async toggleFavorite(placeId: string, userId: string): Promise<boolean> {
    return this.repository.toggleFavorite(placeId, userId);
  }

  async getFavorites(userId: string): Promise<Place[]> {
    return this.repository.getFavorites(userId);
  }

  async getPlaceTypes(): Promise<PlaceType[]> {
    return this.repository.getPlaceTypes();
  }
}

export const placeService = new PlaceService();
