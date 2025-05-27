import React from 'react';
import { BlogPost } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link to={`/blog/${post.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
        {post.images.length > 0 && (
          <div className="aspect-video relative overflow-hidden">
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <CardContent className="p-4 flex-1">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex items-center justify-between w-full text-sm text-gray-500">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.user?.name || 'Anonymous'}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}; 