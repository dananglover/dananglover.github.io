
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, MessageCircle, ArrowRight } from 'lucide-react';

const mockBlogs = [
  {
    id: 1,
    title: "My First Month Living in Danang: A Digital Nomad's Perspective",
    excerpt: "From finding the perfect coffee shops for remote work to discovering hidden beaches, here's what I learned during my first month in this incredible city...",
    author: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face",
    publishedAt: "2024-01-15",
    commentsCount: 12,
    readTime: "5 min read",
    tags: ["Digital Nomad", "Coffee", "Beaches"]
  },
  {
    id: 2,
    title: "The Ultimate Danang Food Guide: 15 Must-Try Local Dishes",
    excerpt: "Discover the authentic flavors of Danang through these local specialties that every food lover should experience at least once...",
    author: "Minh Nguyen",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    publishedAt: "2024-01-12",
    commentsCount: 28,
    readTime: "8 min read",
    tags: ["Food", "Local Culture", "Guide"]
  },
  {
    id: 3,
    title: "Photography Tips: Capturing the Magic of Dragon Bridge",
    excerpt: "The Dragon Bridge is Danang's most iconic landmark. Here are my tips for photographing this architectural marvel during different times of day...",
    author: "Alex Rodriguez",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    publishedAt: "2024-01-10",
    commentsCount: 7,
    readTime: "4 min read",
    tags: ["Photography", "Dragon Bridge", "Tips"]
  }
];

export const RecentBlogs = () => {
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
        {mockBlogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <CardContent className="p-6 flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={blog.authorAvatar} 
                  alt={blog.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{blog.author}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {blog.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {blog.commentsCount} comments
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="px-6 pb-6">
              <Button variant="ghost" className="w-full text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                Read More
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" size="lg" className="border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white">
          View All Stories
        </Button>
      </div>
    </section>
  );
};
