import { supabase, TABLES } from '@/lib/supabase';
import { BlogPost, Comment, CreateBlogPostForm, CreateCommentForm, PaginatedResponse } from '@/types';

export class BlogRepository {
  async getBlogPosts(page = 1, limit = 12): Promise<PaginatedResponse<BlogPost>> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select(`
        *,
        user:users(*)
      `, { count: 'exact' })
      .eq('published', true)
      .order('publishedAt', { ascending: false })
      .range(from, to);

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

  async getBlogPostById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select(`
        *,
        user:users(*)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createBlogPost(postData: CreateBlogPostForm, userId: string): Promise<BlogPost> {
    // Upload images to Supabase Storage
    const imageUrls: string[] = [];
    
    for (const image of postData.images) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl);
    }

    const excerpt = this.generateExcerpt(postData.content);

    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .insert({
        title: postData.title,
        content: postData.content,
        excerpt,
        images: imageUrls,
        userId,
        published: postData.published,
        publishedAt: postData.published ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async updateBlogPost(id: string, postData: Partial<CreateBlogPostForm>, userId: string): Promise<BlogPost> {
    const updateData: any = {
      ...postData,
      updatedAt: new Date().toISOString()
    };

    // Handle image uploads if provided
    if (postData.images && postData.images.length > 0) {
      const imageUrls: string[] = [];
      
      for (const image of postData.images) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }
      
      updateData.images = imageUrls;
    }

    // Update excerpt if content is being updated
    if (postData.content) {
      updateData.excerpt = this.generateExcerpt(postData.content);
    }

    // Set publishedAt if publishing for the first time
    if (postData.published) {
      updateData.publishedAt = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .update(updateData)
      .eq('id', id)
      .eq('userId', userId) // Ensure user can only update their own posts
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async deleteBlogPost(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .delete()
      .eq('id', id)
      .eq('userId', userId); // Ensure user can only delete their own posts

    if (error) throw error;
  }

  async getUserBlogPosts(userId: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from(TABLES.BLOG_POSTS)
      .select(`
        *,
        user:users(*)
      `)
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getBlogComments(blogPostId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .select(`
        *,
        user:users(*)
      `)
      .eq('blogPostId', blogPostId)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createComment(blogPostId: string, commentData: CreateCommentForm, userId: string): Promise<Comment> {
    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .insert({
        blogPostId,
        userId,
        content: commentData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.COMMENTS)
      .delete()
      .eq('id', id)
      .eq('userId', userId); // Ensure user can only delete their own comments

    if (error) throw error;
  }

  generateExcerpt(content: string, maxLength = 200): string {
    // Remove markdown formatting for excerpt
    const textOnly = content
      .replace(/^#{1,6}\s+/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    return textOnly.length > maxLength ? textOnly.substring(0, maxLength) + '...' : textOnly;
  }
}

export const blogRepository = new BlogRepository(); 