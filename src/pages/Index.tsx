import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Redirect to appropriate dashboard based on role
const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    // Redirect based on role
    navigate('/dashboard', { replace: true });
  }, [isAuthenticated, user, isLoading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
};

export default Index;
