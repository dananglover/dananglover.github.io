export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          content: string
          createdAt: string | null
          excerpt: string
          id: string
          images: string[] | null
          published: boolean | null
          publishedAt: string | null
          title: string
          updatedAt: string | null
          userId: string | null
        }
        Insert: {
          content: string
          createdAt?: string | null
          excerpt: string
          id?: string
          images?: string[] | null
          published?: boolean | null
          publishedAt?: string | null
          title: string
          updatedAt?: string | null
          userId?: string | null
        }
        Update: {
          content?: string
          createdAt?: string | null
          excerpt?: string
          id?: string
          images?: string[] | null
          published?: boolean | null
          publishedAt?: string | null
          title?: string
          updatedAt?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          blogPostId: string | null
          content: string
          createdAt: string | null
          id: string
          updatedAt: string | null
          userId: string | null
        }
        Insert: {
          blogPostId?: string | null
          content: string
          createdAt?: string | null
          id?: string
          updatedAt?: string | null
          userId?: string | null
        }
        Update: {
          blogPostId?: string | null
          content?: string
          createdAt?: string | null
          id?: string
          updatedAt?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_blogPostId_fkey"
            columns: ["blogPostId"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          createdAt: string | null
          id: string
          placeId: string | null
          userId: string | null
        }
        Insert: {
          createdAt?: string | null
          id?: string
          placeId?: string | null
          userId?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: string
          placeId?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_placeId_fkey"
            columns: ["placeId"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      place_type: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          createdAt: string | null
          description: string
          id: string
          location: string
          name: string
          photos: string[] | null
          placeTypeId: string | null
          price: string
          rating: number | null
          reviewsCount: number | null
          updatedAt: string | null
          userId: string | null
        }
        Insert: {
          createdAt?: string | null
          description: string
          id?: string
          location: string
          name: string
          photos?: string[] | null
          placeTypeId?: string | null
          price: string
          rating?: number | null
          reviewsCount?: number | null
          updatedAt?: string | null
          userId?: string | null
        }
        Update: {
          createdAt?: string | null
          description?: string
          id?: string
          location?: string
          name?: string
          photos?: string[] | null
          placeTypeId?: string | null
          price?: string
          rating?: number | null
          reviewsCount?: number | null
          updatedAt?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "places_placeTypeId_fkey"
            columns: ["placeTypeId"]
            isOneToOne: false
            referencedRelation: "place_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "places_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string
          createdAt: string | null
          id: string
          placeId: string | null
          rating: number
          updatedAt: string | null
          userId: string | null
        }
        Insert: {
          content: string
          createdAt?: string | null
          id?: string
          placeId?: string | null
          rating: number
          updatedAt?: string | null
          userId?: string | null
        }
        Update: {
          content?: string
          createdAt?: string | null
          id?: string
          placeId?: string | null
          rating?: number
          updatedAt?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_placeId_fkey"
            columns: ["placeId"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          createdAt: string | null
          email: string
          id: string
          name: string
          updatedAt: string | null
        }
        Insert: {
          avatar?: string | null
          createdAt?: string | null
          email: string
          id: string
          name: string
          updatedAt?: string | null
        }
        Update: {
          avatar?: string | null
          createdAt?: string | null
          email?: string
          id?: string
          name?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
