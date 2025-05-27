import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // After a short delay to ensure auth state is updated, redirect to home
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900">Completing sign in...</h1>
          <p className="text-gray-600 mt-2">You will be redirected shortly</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback; 