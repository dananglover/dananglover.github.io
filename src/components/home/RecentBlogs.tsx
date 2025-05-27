
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogService } from '@/services/BlogService';
import { format } from 'date-fns';

export const RecentBlogs = () => {
  const { data: blogData, isLoading } = useQuery({
    queryKey: ['recent-blogs'],
    queryFn: () => blogService.getBlogPosts(1, 3)
  });

  if (isLoading) {
    return (
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recent Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Read the latest insights, tips, and experiences from our community
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const blogs = blogData?.data || [];

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Recent Stories
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Read the latest insights, tips, and experiences from our community
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <CardContent className="p-6 flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={blog.user?.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face"} 
                  alt={blog.user?.name || 'Author'}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{blog.user?.name || 'Anonymous'}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {blog.publishedAt 
                        ? format(new Date(blog.publishedAt), 'MMM d, yyyy')
                        : 'Draft'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {blog.excerpt}
              </p>
            </CardContent>
            
            <CardFooter className="px-6 pb-6">
              <Link to={`/blog/${blog.id}`} className="w-full">
                <Button variant="ghost" className="w-full text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to="/blog">
          <Button variant="outline" size="lg" className="border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white">
            View All Stories
          </Button>
        </Link>
      </div>
    </section>
  );
};
