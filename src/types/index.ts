
// Core entity types
export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export interface PlaceType {
  id: string;
  name: string;
  description?: string | null;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  price: string;
  photos: string[];
  placeTypeId: string;
  placeType?: PlaceType;
  location: string;
  rating: number;
  reviewsCount: number;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  user?: User;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  placeId: string;
  userId: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  images: string[];
  userId: string;
  user?: User;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  blogPostId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface CreatePlaceForm {
  name: string;
  description: string;
  price: string;
  placeTypeId: string;
  location: string;
  photos: File[];
}

export interface CreateBlogPostForm {
  title: string;
  content: string;
  excerpt?: string;
  images: string[];
  published: boolean;
}

export interface CreateReviewForm {
  rating: number;
  content: string;
}

export interface CreateCommentForm {
  content: string;
}
