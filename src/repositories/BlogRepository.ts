
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { BlogPost, Comment, CreateBlogPostForm, CreateCommentForm, PaginatedResponse } from '@/types';

type Tables = Database['public']['Tables'];

export class BlogRepository {
  async getBlogPosts(page = 1, limit = 12): Promise<PaginatedResponse<BlogPost>> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('blog_posts')
      .select(`
        *,
        user:users(*)
      `, { count: 'exact' })
      .eq('published', true)
      .order('publishedAt', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const blogPosts: BlogPost[] = (data || []).map(post => ({
      ...post,
      images: post.images || [],
      userId: post.userId || '',
      user: post.user || undefined
    }));

    return {
      data: blogPosts,
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
      .from('blog_posts')
      .select(`
        *,
        user:users(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      images: data.images || [],
      userId: data.userId || '',
      user: data.user || undefined
    };
  }

  async createBlogPost(postData: CreateBlogPostForm, userId: string): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        images: postData.images,
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

    return {
      ...data,
      images: data.images || [],
      userId: data.userId || '',
      user: data.user || undefined
    };
  }

  async updateBlogPost(id: string, updateData: Partial<CreateBlogPostForm>, userId: string): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...updateData,
        publishedAt: updateData.published ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .eq('userId', userId)
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      images: data.images || [],
      userId: data.userId || '',
      user: data.user || undefined
    };
  }

  async deleteBlogPost(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
      .eq('userId', userId);

    if (error) throw error;
  }

  async getUserBlogPosts(userId: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        user:users(*)
      `)
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return (data || []).map(post => ({
      ...post,
      images: post.images || [],
      userId: post.userId || '',
      user: post.user || undefined
    }));
  }

  async getBlogComments(blogPostId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(*)
      `)
      .eq('blogPostId', blogPostId)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return (data || []).map(comment => ({
      ...comment,
      blogPostId: comment.blogPostId || '',
      userId: comment.userId || '',
      user: comment.user || undefined
    }));
  }

  async createComment(blogPostId: string, commentData: CreateCommentForm, userId: string): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        blogPostId,
        content: commentData.content,
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

    return {
      ...data,
      blogPostId: data.blogPostId || '',
      userId: data.userId || '',
      user: data.user || undefined
    };
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .eq('userId', userId);

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
