import { supabase } from '@/integrations/supabase/client';
import { Place, PlaceType, Review, CreatePlaceForm, CreateReviewForm, PaginatedResponse } from '@/types';

const TABLES = {
  PLACES: 'places',
  PLACE_TYPES: 'place_type',
  REVIEWS: 'reviews',
  FAVORITES: 'favorites'
} as const;

export class PlaceRepository {
  async getPlaces(page = 1, limit = 12, placeTypeId?: string): Promise<PaginatedResponse<Place>> {
    let query = supabase
      .from(TABLES.PLACES)
      .select(`
        *,
        placeType:place_type(*),
        user:users(*)
      `, { count: 'exact' })
      .order('createdAt', { ascending: false });

    if (placeTypeId) {
      query = query.eq('placeTypeId', placeTypeId);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  }

  async getPlaceById(id: string): Promise<Place | null> {
    const { data, error } = await supabase
      .from(TABLES.PLACES)
      .select(`
        *,
        placeType:place_type(*),
        user:users(*)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createPlace(placeData: CreatePlaceForm, userId: string): Promise<Place> {
    // Upload photos to Supabase Storage
    const photoUrls: string[] = [];
    
    for (const photo of placeData.photos) {
      const fileName = `${Date.now()}-${photo.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('place-photos')
        .upload(fileName, photo);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('place-photos')
        .getPublicUrl(fileName);

      photoUrls.push(publicUrl);
    }

    const { data, error } = await supabase
      .from(TABLES.PLACES)
      .insert({
        name: placeData.name,
        description: placeData.description,
        price: placeData.price,
        photos: photoUrls,
        placeTypeId: placeData.placeTypeId,
        location: placeData.location,
        rating: 0,
        reviewsCount: 0,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select(`
        *,
        placeType:place_type(*),
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async updatePlace(id: string, placeData: Partial<CreatePlaceForm>, userId: string): Promise<Place> {
    const updateData: any = {
      ...placeData,
      updatedAt: new Date().toISOString()
    };

    // Handle photo uploads if provided
    if (placeData.photos && placeData.photos.length > 0) {
      const photoUrls: string[] = [];
      
      for (const photo of placeData.photos) {
        const fileName = `${Date.now()}-${photo.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('place-photos')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('place-photos')
          .getPublicUrl(fileName);

        photoUrls.push(publicUrl);
      }
      
      updateData.photos = photoUrls;
    }

    const { data, error } = await supabase
      .from(TABLES.PLACES)
      .update(updateData)
      .eq('id', id)
      .eq('userId', userId) // Ensure user can only update their own places
      .select(`
        *,
        placeType:place_type(*),
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async deletePlace(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.PLACES)
      .delete()
      .eq('id', id)
      .eq('userId', userId); // Ensure user can only delete their own places

    if (error) throw error;
  }

  async getPlaceReviews(placeId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from(TABLES.REVIEWS)
      .select(`
        *,
        user:users(*)
      `)
      .eq('placeId', placeId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createReview(placeId: string, reviewData: CreateReviewForm, userId: string): Promise<Review> {
    const { data, error } = await supabase
      .from(TABLES.REVIEWS)
      .insert({
        placeId,
        userId,
        rating: reviewData.rating,
        content: reviewData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;

    // Update place rating and reviews count
    await this.updatePlaceRating(placeId);

    return data;
  }

  async toggleFavorite(placeId: string, userId: string): Promise<boolean> {
    // Check if favorite exists
    const { data: existingFavorite } = await supabase
      .from(TABLES.FAVORITES)
      .select('id')
      .eq('placeId', placeId)
      .eq('userId', userId)
      .single();

    if (existingFavorite) {
      // Remove favorite
      const { error } = await supabase
        .from(TABLES.FAVORITES)
        .delete()
        .eq('placeId', placeId)
        .eq('userId', userId);

      if (error) throw error;
      return false;
    } else {
      // Add favorite
      const { error } = await supabase
        .from(TABLES.FAVORITES)
        .insert({
          placeId,
          userId,
          createdAt: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    }
  }

  async getFavorites(userId: string): Promise<Place[]> {
    const { data, error } = await supabase
      .from(TABLES.FAVORITES)
      .select(`
        place:places(
          *,
          placeType:place_type(*),
          user:users(*)
        )
      `)
      .eq('userId', userId);

    if (error) throw error;
    return (data?.map((item: any) => item.place).filter(Boolean) || []) as Place[];
  }

  async getPlaceTypes(): Promise<PlaceType[]> {
    const { data, error } = await supabase
      .from(TABLES.PLACE_TYPES)
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  private async updatePlaceRating(placeId: string): Promise<void> {
    // Calculate average rating and count
    const { data: reviews } = await supabase
      .from(TABLES.REVIEWS)
      .select('rating')
      .eq('placeId', placeId);

    if (reviews && reviews.length > 0) {
      const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await supabase
        .from(TABLES.PLACES)
        .update({
          rating: Math.round(average * 10) / 10, // Round to 1 decimal place
          reviewsCount: reviews.length,
          updatedAt: new Date().toISOString()
        })
        .eq('id', placeId);
    }
  }
}

export const placeRepository = new PlaceRepository();
