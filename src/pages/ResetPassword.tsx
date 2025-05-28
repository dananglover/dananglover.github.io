import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);
    const [checkingToken, setCheckingToken] = useState(true);

    useEffect(() => {
        // Check if we have a valid password reset token
        const checkToken = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error || !session) {
                    toast({
                        title: "Invalid or expired link",
                        description: "This password reset link is invalid or has expired. Please request a new one.",
                        variant: "destructive",
                    });
                    navigate('/');
                } else {
                    setIsValidToken(true);
                }
            } catch (error) {
                console.error('Error checking token:', error);
                toast({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                });
                navigate('/');
            } finally {
                setCheckingToken(false);
            }
        };

        checkToken();
    }, [navigate, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            toast({
                title: "Success",
                description: "Your password has been reset successfully! Redirecting to home...",
            });

            // Sign out to ensure clean state
            await supabase.auth.signOut();

            // Redirect after a short delay
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to reset password. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (checkingToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
                <Navigation />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
                        <h1 className="text-2xl font-semibold text-gray-900">Verifying reset link...</h1>
                    </div>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto mt-8">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                <Lock className="h-6 w-6 text-orange-600" />
                            </div>
                            <CardTitle>Reset Your Password</CardTitle>
                            <CardDescription>
                                Enter your new password below
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        disabled={loading}
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        disabled={loading}
                                        placeholder="Confirm new password"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resetting password...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword; 