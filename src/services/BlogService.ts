
import { BlogPost, CreateBlogPostForm, Comment, CreateCommentForm, PaginatedResponse } from '@/types';

export class BlogService {
  async getBlogPosts(page = 1, limit = 12): Promise<PaginatedResponse<BlogPost>> {
    // Mock implementation - replace with actual Supabase calls
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: "My First Month Living in Danang: A Digital Nomad's Perspective",
        content: `# My First Month Living in Danang

Moving to Danang as a digital nomad has been an incredible journey. Here are my thoughts and experiences...

## The Coffee Culture

The coffee scene here is absolutely amazing. From the traditional Vietnamese coffee served with condensed milk to modern specialty coffee shops...`,
        excerpt: "From finding the perfect coffee shops for remote work to discovering hidden beaches, here's what I learned during my first month in this incredible city...",
        images: [],
        userId: 'user1',
        published: true,
        publishedAt: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ];

    return {
      data: mockPosts,
      pagination: {
        page,
        limit,
        total: mockPosts.length,
        totalPages: Math.ceil(mockPosts.length / limit)
      }
    };
  }

  async getBlogPostById(id: string): Promise<BlogPost | null> {
    return {
      id,
      title: "My First Month Living in Danang: A Digital Nomad's Perspective",
      content: `# My First Month Living in Danang

Moving to Danang as a digital nomad has been an incredible journey. Here are my thoughts and experiences...

## The Coffee Culture

The coffee scene here is absolutely amazing. From the traditional Vietnamese coffee served with condensed milk to modern specialty coffee shops, there's something for every coffee lover.

### My Favorite Spots

1. **Cong Caphe** - Perfect for people watching
2. **The Workshop** - Great for remote work
3. **Heart Coffee Roastery** - Best specialty coffee

## The Beaches

Living near the beach has been one of the biggest perks...`,
      excerpt: "From finding the perfect coffee shops for remote work to discovering hidden beaches, here's what I learned during my first month in this incredible city...",
      images: [],
      userId: 'user1',
      published: true,
      publishedAt: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    };
  }

  async createBlogPost(postData: CreateBlogPostForm): Promise<BlogPost> {
    console.log('Creating blog post:', postData);
    
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: postData.title,
      content: postData.content,
      excerpt: postData.content.substring(0, 200) + '...',
      images: [], // Would be uploaded image URLs
      userId: 'current-user',
      published: postData.published,
      publishedAt: postData.published ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return newPost;
  }

  async getBlogComments(blogPostId: string): Promise<Comment[]> {
    return [];
  }

  async createComment(blogPostId: string, commentData: CreateCommentForm): Promise<Comment> {
    console.log('Creating comment for post:', blogPostId, commentData);
    
    return {
      id: `comment-${Date.now()}`,
      blogPostId,
      userId: 'current-user',
      content: commentData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  generateExcerpt(content: string, maxLength = 200): string {
    const textOnly = content.replace(/[#*`]/g, '').trim();
    return textOnly.length > maxLength ? textOnly.substring(0, maxLength) + '...' : textOnly;
  }
}

export const blogService = new BlogService();
