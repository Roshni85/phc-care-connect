import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import {
  User,
  Phone,
  Building,
  MapPin,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const roleColors: Record<string, string> = {
  LHV: 'bg-primary text-primary-foreground',
  ANM: 'bg-secondary text-secondary-foreground',
  ASHA_SUPERVISOR: 'bg-info text-info-foreground',
  LAB_TECH: 'bg-warning text-warning-foreground',
  PHARMACIST: 'bg-success text-success-foreground',
  ADMIN: 'bg-foreground text-background',
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  const menuItems = [
    { icon: Bell, label: 'Notifications', onClick: () => toast.info('Coming soon') },
    { icon: Shield, label: 'Security', onClick: () => toast.info('Coming soon') },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => toast.info('Coming soon') },
    { icon: FileText, label: 'Terms & Conditions', onClick: () => toast.info('Coming soon') },
  ];

  return (
    <AppShell hasBottomNav={false}>
      <PageHeader title="Profile" showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="rounded-xl bg-card p-6 shadow-card text-center">
          <div className={cn(
            'mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold',
            roleColors[user.role]
          )}>
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">{user.name}</h2>
          <span className={cn(
            'mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium',
            roleColors[user.role]
          )}>
            {user.role.replace('_', ' ')}
          </span>
        </div>

        {/* Info Cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium text-foreground">{user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Building className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Primary Health Centre</p>
              <p className="font-medium text-foreground">{user.phc_name}</p>
            </div>
          </div>

          {user.sub_centres && user.sub_centres.length > 0 && (
            <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Sub-Centres</p>
                <p className="font-medium text-foreground">{user.sub_centres.join(', ')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="rounded-xl bg-card shadow-card divide-y divide-border">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex w-full items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 font-medium text-foreground">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground">
          PHC Staff Portal v1.0.0
        </p>
      </div>
    </AppShell>
  );
}
