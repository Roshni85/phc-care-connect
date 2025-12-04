import { useAuth } from '@/contexts/AuthContext';
import LHVDashboard from '@/pages/lhv/LHVDashboard';
import PharmacyDashboard from '@/pages/pharmacist/PharmacyDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import { Navigate } from 'react-router-dom';

export default function RoleBasedDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'LHV':
    case 'ANM':
    case 'ASHA_SUPERVISOR':
      return <LHVDashboard />;
    case 'PHARMACIST':
      return <PharmacyDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'LAB_TECH':
      // For now, lab tech can use a simplified version
      return <LHVDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}
