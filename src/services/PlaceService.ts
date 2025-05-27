import { Place, CreatePlaceForm, Review, CreateReviewForm, PaginatedResponse, PlaceType } from '@/types';
import { placeRepository } from '@/repositories/PlaceRepository';

export class PlaceService {
  constructor(private repository = placeRepository) {}

  async getPlaces(page = 1, limit = 12, placeTypeId?: string): Promise<PaginatedResponse<Place>> {
    return this.repository.getPlaces(page, limit, placeTypeId);
  }

  async getPlaceById(id: string): Promise<Place | null> {
    return this.repository.getPlaceById(id);
  }

  async createPlace(placeData: CreatePlaceForm, userId: string): Promise<Place> {
    return this.repository.createPlace(placeData, userId);
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
