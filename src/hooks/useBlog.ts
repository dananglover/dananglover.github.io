
import { useState, useEffect } from 'react';
import { BlogPost, PaginatedResponse } from '@/types';
import { blogService } from '@/services/BlogService';

export const useBlogPosts = (page = 1, limit = 12) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await blogService.getBlogPosts(page, limit);
        setPosts(response.data);
        setPagination(response.pagination);
        setError(null);
      } catch (err) {
        setError('Failed to fetch blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit]);

  return {
    posts,
    pagination,
    loading,
    error,
    refetch: () => {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const response = await blogService.getBlogPosts(page, limit);
          setPosts(response.data);
          setPagination(response.pagination);
          setError(null);
        } catch (err) {
          setError('Failed to fetch blog posts');
          console.error('Error fetching blog posts:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  };
};

export const useBlogPost = (id: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await blogService.getBlogPostById(id);
        setPost(response);
        setError(null);
      } catch (err) {
        setError('Failed to fetch blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  return { post, loading, error };
};
