import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { blogService } from '@/services/BlogService';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const { data: blogData, isLoading } = useQuery({
    queryKey: ['blog-posts', currentPage],
    queryFn: () => blogService.getBlogPosts(currentPage, 12)
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            <p className="text-gray-600 mt-2">Stories and experiences from Danang lovers</p>
          </div>
          
          {user && (
            <Link to="/blog/create">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Write Post
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogData?.data.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {blogData?.data.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No blog posts yet. Be the first to share your story!</p>
              </div>
            )}

            {blogData && blogData.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: blogData.pagination.totalPages }, (_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog; 