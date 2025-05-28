
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Edit } from 'lucide-react';
import { blogService } from '@/services/BlogService';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CommentSection } from '@/components/blog/CommentSection';
import { useAuth } from '@/contexts/AuthContext';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => blogService.getBlogPostById(id!),
    enabled: !!id
  });

  const handleEditPost = () => {
    navigate(`/blog/${id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && post.userId === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link to="/blog" className="inline-flex items-center text-orange-600 hover:text-orange-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            
            {isOwner && (
              <Button
                onClick={handleEditPost}
                variant="outline"
                className="bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </Button>
            )}
          </div>

          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={post.user?.avatar || undefined} />
                    <AvatarFallback>
                      {post.user?.name?.[0]?.toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{post.user?.name || 'Anonymous'}</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {post.publishedAt
                      ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
                      : 'Draft'
                    }
                  </span>
                </div>
              </div>
            </header>

            {post.images.length > 0 && (
              <div className="mb-8">
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            <Card>
              <CardContent className="prose prose-lg max-w-none p-8">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-gray-900">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3 text-gray-900 mt-8">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-semibold mb-2 text-gray-900 mt-6">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed whitespace-pre-wrap">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                    pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 whitespace-pre-wrap">{children}</pre>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-orange-500 pl-4 italic text-gray-600 mb-4">{children}</blockquote>,
                    a: ({ href, children }) => (
                      <a
                        href={typeof href === 'string' ? href : '#'}
                        className="text-orange-600 hover:text-orange-700 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    br: () => <br />,
                  }}
                  skipHtml={false}
                >
                  {post.content}
                </ReactMarkdown>
              </CardContent>
            </Card>

            <div className="mt-12">
              <CommentSection blogPostId={post.id} />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
