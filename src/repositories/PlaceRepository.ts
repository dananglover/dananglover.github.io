import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Place, PlaceType, Review, CreatePlaceForm, CreateReviewForm, PaginatedResponse } from '@/types';

type Tables = Database['public']['Tables'];
type PlacesRow = Tables['places']['Row'];
type PlacesInsert = Tables['places']['Insert'];
type PlacesUpdate = Tables['places']['Update'];
type ReviewsRow = Tables['reviews']['Row'];
type ReviewsInsert = Tables['reviews']['Insert'];
type ReviewsUpdate = Tables['reviews']['Update'];
type FavoritesRow = Tables['favorites']['Row'];
type FavoritesInsert = Tables['favorites']['Insert'];
type FavoritesUpdate = Tables['favorites']['Update'];
type PlaceTypeRow = Tables['place_type']['Row'];
type PlaceTypeInsert = Tables['place_type']['Insert'];
type PlaceTypeUpdate = Tables['place_type']['Update'];

export class PlaceRepository {
  async getPlaces(page = 1, limit = 12, placeTypeId?: string): Promise<PaginatedResponse<Place>> {
    let query = supabase
      .from('places')
      .select<'places', PlacesRow>(`
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
      .from('places')
      .select<'places', PlacesRow>(`
        *,
        placeType:place_type(*),
        user:users(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createPlace(placeData: CreatePlaceForm, userId: string): Promise<Place> {
    // Upload photos to Supabase Storage
    const photoUrls: string[] = [];
    for (const photo of placeData.photos) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('place-photos')
        .upload(fileName, photo);

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        throw new Error('Failed to upload photo');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('place-photos')
        .getPublicUrl(fileName);

      photoUrls.push(publicUrl);
    }

    // Create place record
    const { data, error } = await supabase
      .from('places')
      .insert<PlacesInsert>({
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
      .select<'places', PlacesRow>(`
        *,
        placeType:place_type(*),
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async updatePlace(id: string, updateData: Partial<CreatePlaceForm>, userId: string): Promise<Place> {
    const { data, error } = await supabase
      .from('places')
      .update<PlacesUpdate>({
        ...updateData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .eq('userId', userId)
      .select<'places', PlacesRow>(`
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
      .from('places')
      .delete()
      .eq('id', id)
      .eq('userId', userId);

    if (error) throw error;
  }

  async getPlaceReviews(placeId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select<'reviews', ReviewsRow>(`
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
      .from('reviews')
      .insert<ReviewsInsert>({
        placeId,
        content: reviewData.content,
        rating: reviewData.rating,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select<'reviews', ReviewsRow>(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;

    // Update place rating
    await this.updatePlaceRating(placeId);

    return data;
  }

  async toggleFavorite(placeId: string, userId: string): Promise<boolean> {
    // Check if favorite exists
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select<'favorites', FavoritesRow>('id')
      .eq('placeId', placeId)
      .eq('userId', userId)
      .single();

    if (existingFavorite) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('placeId', placeId)
        .eq('userId', userId);

      if (error) throw error;
      return false;
    } else {
      // Add favorite
      const { error } = await supabase
        .from('favorites')
        .insert<FavoritesInsert>({
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
      .from('favorites')
      .select<'favorites', FavoritesRow>(`
        place:places(
          *,
          placeType:place_type(*),
          user:users(*)
        )
      `)
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data?.map(favorite => favorite.place) || [];
  }

  async getPlaceTypes(): Promise<PlaceType[]> {
    const { data, error } = await supabase
      .from('place_type')
      .select<'place_type', PlaceTypeRow>('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  private async updatePlaceRating(placeId: string): Promise<void> {
    // Calculate average rating and count
    const { data: reviews } = await supabase
      .from('reviews')
      .select<'reviews', ReviewsRow>('rating')
      .eq('placeId', placeId);

    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const average = totalRating / reviews.length;

      await supabase
        .from('places')
        .update<PlacesUpdate>({
          rating: Math.round(average * 10) / 10, // Round to 1 decimal place
          reviewsCount: reviews.length,
          updatedAt: new Date().toISOString()
        })
        .eq('id', placeId);
    }
  }
}

export const placeRepository = new PlaceRepository();