
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useAuth } from '@/contexts/AuthContext';
import { blogService } from '@/services/BlogService';
import { Comment, CreateCommentForm } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface CommentSectionProps {
    blogPostId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ blogPostId }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState('');

    const { data: comments, isLoading } = useQuery({
        queryKey: ['blog-comments', blogPostId],
        queryFn: () => blogService.getBlogPostComments(blogPostId)
    });

    const createCommentMutation = useMutation({
        mutationFn: (commentData: CreateCommentForm) =>
            blogService.createComment(blogPostId, commentData, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-comments', blogPostId] });
            setNewComment('');
            toast.success('Comment posted successfully!');
        },
        onError: () => {
            toast.error('Failed to post comment. Please try again.');
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: string) =>
            blogService.deleteComment(commentId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog-comments', blogPostId] });
            toast.success('Comment deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete comment. Please try again.');
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

    const handleDeleteComment = (commentId: string) => {
        deleteCommentMutation.mutate(commentId);
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
                            <RichTextEditor
                                value={newComment}
                                onChange={setNewComment}
                                placeholder="Share your thoughts..."
                                minHeight="120px"
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
                    comments.map((comment: Comment) => (
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
                                            <div>
                                                <p className="font-medium">{comment.user?.name || 'Anonymous'}</p>
                                                <span className="text-sm text-gray-500">
                                                    {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                                                </span>
                                            </div>
                                            {user && comment.userId === user.id && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this comment? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                        <div className="mt-2 text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: comment.content }} />
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
