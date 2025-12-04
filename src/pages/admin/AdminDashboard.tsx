import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatCard } from '@/components/ui/stat-card';
import { ActionCard } from '@/components/ui/action-card';
import { mockStaffMembers, mockProgrammeModules } from '@/data/mockAdmin';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Settings,
  User,
  Bell,
  UserPlus,
  MapPin,
  Layers,
  Shield,
} from 'lucide-react';
import { format } from 'date-fns';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/admin/staff', label: 'Staff', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeStaff = mockStaffMembers.filter((s) => s.is_active).length;
  const enabledModules = mockProgrammeModules.filter((m) => m.is_enabled).length;

  const today = format(new Date(), 'EEEE, MMMM d');

  // Group staff by role
  const staffByRole = mockStaffMembers.reduce((acc, staff) => {
    acc[staff.role] = (acc[staff.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppShell>
      {/* Header */}
      <header className="bg-gradient-to-br from-foreground to-foreground/90 text-background px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-background/70 text-sm">{today}</p>
            <h1 className="text-xl font-bold mt-1">Admin Panel</h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 hover:bg-background/20 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-background/10 p-4">
            <p className="text-background/70 text-xs">Active Staff</p>
            <p className="text-2xl font-bold mt-1">{activeStaff}</p>
          </div>
          <div className="rounded-xl bg-background/10 p-4">
            <p className="text-background/70 text-xs">Active Modules</p>
            <p className="text-2xl font-bold mt-1">{enabledModules}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <ActionCard
              title="Manage Staff"
              description="Add, edit, or deactivate staff accounts"
              icon={Users}
              badge={mockStaffMembers.length}
              onClick={() => navigate('/admin/staff')}
            />
            <ActionCard
              title="Add New Staff"
              description="Create a new staff account"
              icon={UserPlus}
              onClick={() => navigate('/admin/staff/new')}
            />
            <ActionCard
              title="Manage Mappings"
              description="Staff to PHC, sub-centre, village"
              icon={MapPin}
              onClick={() => navigate('/admin/mappings')}
            />
            <ActionCard
              title="Programme Modules"
              description="Enable or disable programme modules"
              icon={Layers}
              onClick={() => navigate('/admin/settings')}
            />
          </div>
        </section>

        {/* Staff Overview */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Staff Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="LHV"
              value={staffByRole['LHV'] || 0}
              icon={Shield}
              iconClassName="bg-primary/10"
            />
            <StatCard
              title="ANM"
              value={staffByRole['ANM'] || 0}
              icon={User}
              iconClassName="bg-secondary/10"
            />
            <StatCard
              title="Pharmacist"
              value={staffByRole['PHARMACIST'] || 0}
              icon={User}
              iconClassName="bg-info/10"
            />
            <StatCard
              title="Others"
              value={(staffByRole['LAB_TECH'] || 0) + (staffByRole['ASHA_SUPERVISOR'] || 0)}
              icon={Users}
              iconClassName="bg-muted"
            />
          </div>
        </section>

        {/* PHC Info */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            PHC Information
          </h2>
          <div className="rounded-xl bg-card p-4 shadow-card">
            <h3 className="font-semibold text-foreground mb-1">{user?.phc_name}</h3>
            <p className="text-sm text-muted-foreground">PHC ID: {user?.phc_id}</p>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Sub-Centres</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">6</p>
                <p className="text-xs text-muted-foreground">Villages</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">17.7K</p>
                <p className="text-xs text-muted-foreground">Population</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNav items={navItems} />
    </AppShell>
  );
}
