import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, StarHalf } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { placeService } from '@/services/PlaceService';
import { Review, CreateReviewForm } from '@/types';

interface ReviewSectionProps {
    placeId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ placeId }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [newReview, setNewReview] = useState<CreateReviewForm>({
        content: '',
        rating: 5
    });

    const { data: reviews, isLoading } = useQuery({
        queryKey: ['place-reviews', placeId],
        queryFn: () => placeService.getPlaceReviews(placeId)
    });

    const createReviewMutation = useMutation({
        mutationFn: (reviewData: CreateReviewForm) =>
            placeService.createReview(placeId, reviewData, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['place-reviews', placeId] });
            queryClient.invalidateQueries({ queryKey: ['place', placeId] });
            setNewReview({ content: '', rating: 5 });
            toast.success('Review posted successfully!');
        },
        onError: (error) => {
            toast.error('Failed to post review. Please try again.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please sign in to post a review');
            return;
        }
        if (!newReview.content.trim()) {
            toast.error('Please write a review');
            return;
        }
        createReviewMutation.mutate(newReview);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} className="w-5 h-5 fill-orange-400 text-orange-400" />);
        }
        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="w-5 h-5 fill-orange-400 text-orange-400" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
        }

        return stars;
    };

    return (
        <div className="space-y-6">
            {user && (
                <Card>
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${rating <= newReview.rating
                                                ? 'fill-orange-400 text-orange-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <Textarea
                                value={newReview.content}
                                onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Share your experience..."
                                className="min-h-[100px]"
                                required
                            />
                            <Button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600"
                                disabled={createReviewMutation.isPending}
                            >
                                {createReviewMutation.isPending ? 'Posting...' : 'Post Review'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Reviews</h3>
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <Card key={review.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start space-x-4">
                                    <Avatar>
                                        <AvatarImage src={review.user?.avatar || undefined} />
                                        <AvatarFallback>
                                            {review.user?.name?.[0]?.toUpperCase() || 'A'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                                                <div className="flex items-center space-x-1 mt-1">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{review.content}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
}; 