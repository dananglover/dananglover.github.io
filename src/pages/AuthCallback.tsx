
import { Navigation } from '@/components/layout/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log('AuthCallback - user:', !!user, 'loading:', loading, 'hasRedirected:', hasRedirected);

    // If we're not loading and haven't redirected yet
    if (!loading && !hasRedirected) {
      setHasRedirected(true);
      
      if (user) {
        console.log('User authenticated, redirecting to home');
        navigate('/', { replace: true });
      } else {
        console.log('No user found, redirecting to home');
        // Even if no user, redirect to home (they might have cancelled the flow)
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate, hasRedirected]);

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
