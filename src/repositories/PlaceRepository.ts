import { supabase } from '@/integrations/supabase/client';
import { Place, PlaceType, Review, CreatePlaceForm, CreateReviewForm, PaginatedResponse } from '@/types';

export class PlaceRepository {
  async getPlaces(page = 1, limit = 12, placeTypeId?: string): Promise<PaginatedResponse<Place>> {
    let query = supabase
      .from('places')
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

    const places: Place[] = (data || []).map(place => ({
      ...place,
      photos: place.photos || [],
      userId: place.userId || '',
      placeTypeId: place.placeTypeId || '',
      placeType: place.placeType ? {
        id: place.placeType.id,
        name: place.placeType.name,
        description: place.placeType.description || undefined
      } : undefined,
      user: place.user || undefined,
      createdAt: place.createdAt || new Date().toISOString(),
      updatedAt: place.updatedAt || new Date().toISOString()
    }));

    return {
      data: places,
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
      .select(`
        *,
        placeType:place_type(*),
        user:users(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      photos: data.photos || [],
      userId: data.userId || '',
      placeTypeId: data.placeTypeId || '',
      placeType: data.placeType ? {
        id: data.placeType.id,
        name: data.placeType.name,
        description: data.placeType.description || undefined
      } : undefined,
      user: data.user || undefined,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
  }

  async createPlace(placeData: CreatePlaceForm, userId: string): Promise<Place> {
    // Upload photos to Supabase Storage
    const photoUrls: string[] = [];
    for (const photo of placeData.photos) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const { error: uploadError } = await supabase.storage
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
    return {
      ...data,
      photos: data.photos || [],
      userId: data.userId || '',
      placeTypeId: data.placeTypeId || '',
      placeType: data.placeType ? {
        id: data.placeType.id,
        name: data.placeType.name,
        description: data.placeType.description || undefined
      } : undefined,
      user: data.user || undefined,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
  }

  async updatePlace(id: string, updateData: Omit<Partial<CreatePlaceForm>, 'photos'>, userId: string): Promise<Place> {
    const { data, error } = await supabase
      .from('places')
      .update({
        ...updateData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .eq('userId', userId)
      .select(`
        *,
        placeType:place_type(*),
        user:users(*)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      photos: data.photos || [],
      userId: data.userId || '',
      placeTypeId: data.placeTypeId || '',
      placeType: data.placeType ? {
        id: data.placeType.id,
        name: data.placeType.name,
        description: data.placeType.description || undefined
      } : undefined,
      user: data.user || undefined,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
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
      .select(`
        *,
        user:users(*)
      `)
      .eq('placeId', placeId)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return (data || []).map(review => ({
      ...review,
      placeId: review.placeId || '',
      userId: review.userId || '',
      user: review.user || undefined,
      createdAt: review.createdAt || new Date().toISOString(),
      updatedAt: review.updatedAt || new Date().toISOString()
    }));
  }

  async createReview(placeId: string, reviewData: CreateReviewForm, userId: string): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        placeId,
        content: reviewData.content,
        rating: reviewData.rating,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;

    // Update place rating
    await this.updatePlaceRating(placeId);

    return {
      ...data,
      placeId: data.placeId || '',
      userId: data.userId || '',
      user: data.user || undefined,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
  }

  async deleteReview(id: string, userId: string): Promise<void> {
    // Get the place ID before deleting the review to update rating
    const { data: review } = await supabase
      .from('reviews')
      .select('placeId')
      .eq('id', id)
      .eq('userId', userId)
      .single();

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
      .eq('userId', userId);

    if (error) throw error;

    // Update place rating after deletion
    if (review) {
      await this.updatePlaceRating(review.placeId);
    }
  }

  async toggleFavorite(placeId: string, userId: string): Promise<boolean> {
    // Check if favorite exists
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
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
      .from('favorites')
      .select(`
        place:places(
          *,
          placeType:place_type(*),
          user:users(*)
        )
      `)
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return (data?.map(favorite => ({
      ...favorite.place,
      photos: favorite.place.photos || [],
      userId: favorite.place.userId || '',
      placeTypeId: favorite.place.placeTypeId || '',
      placeType: favorite.place.placeType ? {
        id: favorite.place.placeType.id,
        name: favorite.place.placeType.name,
        description: favorite.place.placeType.description || undefined
      } : undefined,
      user: favorite.place.user || undefined,
      createdAt: favorite.place.createdAt || new Date().toISOString(),
      updatedAt: favorite.place.updatedAt || new Date().toISOString()
    })) || []) as Place[];
  }

  async getPlaceTypes(): Promise<PlaceType[]> {
    const { data, error } = await supabase
      .from('place_type')
      .select('*')
      .order('name');

    if (error) throw error;
    return (data || []).map(type => ({
      id: type.id,
      name: type.name,
      description: type.description || undefined
    }));
  }

  private async updatePlaceRating(placeId: string): Promise<void> {
    // Calculate average rating and count
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('placeId', placeId);

    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const average = totalRating / reviews.length;

      await supabase
        .from('places')
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
