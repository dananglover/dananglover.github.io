import { blogRepository } from '@/repositories/BlogRepository';
import { BlogPost, Comment, CreateBlogPostForm, CreateCommentForm, PaginatedResponse } from '@/types';

export class BlogService {
  constructor(private repository = blogRepository) {}

  async getBlogPosts(page = 1, limit = 12): Promise<PaginatedResponse<BlogPost>> {
    return this.repository.getBlogPosts(page, limit);
  }

  async getBlogPostById(id: string): Promise<BlogPost | null> {
    return this.repository.getBlogPostById(id);
  }

  async createBlogPost(postData: CreateBlogPostForm, userId: string): Promise<BlogPost> {
    return this.repository.createBlogPost(postData, userId);
  }

  async updateBlogPost(id: string, postData: Partial<CreateBlogPostForm>, userId: string): Promise<BlogPost> {
    return this.repository.updateBlogPost(id, postData, userId);
  }

  async deleteBlogPost(id: string, userId: string): Promise<void> {
    return this.repository.deleteBlogPost(id, userId);
  }

  async getUserBlogPosts(userId: string): Promise<BlogPost[]> {
    return this.repository.getUserBlogPosts(userId);
  }

  async getBlogComments(blogPostId: string): Promise<Comment[]> {
    return this.repository.getBlogComments(blogPostId);
  }

  async createComment(blogPostId: string, commentData: CreateCommentForm, userId: string): Promise<Comment> {
    return this.repository.createComment(blogPostId, commentData, userId);
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    return this.repository.deleteComment(id, userId);
  }

  generateExcerpt(content: string, maxLength = 200): string {
    return this.repository.generateExcerpt(content, maxLength);
  }
}

export const blogService = new BlogService();
