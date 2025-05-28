import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { blogService } from '@/services/BlogService';
import { Comment, CreateCommentForm } from '@/types';

interface CommentSectionProps {
    blogPostId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ blogPostId }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState('');

    const { data: comments, isLoading } = useQuery({
        queryKey: ['blog-comments', blogPostId],
        queryFn: () => blogService.getBlogComments(blogPostId)
    });

    const createCommentMutation = useMutation({
        mutationFn: (commentData: CreateCommentForm) =>
            blogService.createComment(blogPostId, commentData, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-comments', blogPostId] });
            setNewComment('');
            toast.success('Comment posted successfully!');
        },
        onError: (error) => {
            toast.error('Failed to post comment. Please try again.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please sign in to post a comment');
            return;
        }
        if (!newComment.trim()) {
            toast.error('Please write a comment');
            return;
        }
        createCommentMutation.mutate({ content: newComment });
    };

    return (
        <div className="space-y-6">
            {user && (
                <Card>
                    <CardHeader>
                        <CardTitle>Leave a Comment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="min-h-[100px]"
                                required
                            />
                            <Button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600"
                                disabled={createCommentMutation.isPending}
                            >
                                {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Comments</h3>
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <Card key={comment.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start space-x-4">
                                    <Avatar>
                                        <AvatarImage src={comment.user?.avatar || undefined} />
                                        <AvatarFallback>
                                            {comment.user?.name?.[0]?.toUpperCase() || 'A'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium">{comment.user?.name || 'Anonymous'}</p>
                                            <span className="text-sm text-gray-500">
                                                {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
}; 