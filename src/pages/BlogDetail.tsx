import { Navigation } from '@/components/layout/Navigation';
import { CommentSection } from '@/components/blog/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useBlogPost } from '@/hooks/useBlog';
import { ArrowLeft, Edit } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { post, loading, error } = useBlogPost(id!);

  const handleEditPost = () => {
    navigate(`/blog/${id}/edit`);
  };

  if (loading) {
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

          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {post.images && post.images.length > 0 && (
              <img
                src={post.images[0]}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            )}

            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
                {post.publishedAt && (
                  <span className="text-sm text-gray-500">
                    {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

              <div className="flex items-center text-gray-600 mb-8">
                <span>By {post.user?.name || 'Anonymous'}</span>
              </div>

              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </article>

          <div className="mt-12">
            <CommentSection blogPostId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
