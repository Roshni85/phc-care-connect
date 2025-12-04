import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockStaffMembers } from '@/data/mockAdmin';
import { UserRole } from '@/types/auth';
import {
  Home,
  Users,
  Settings,
  User,
  Search,
  Plus,
  ChevronRight,
  Phone,
  Shield,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/admin/staff', label: 'Staff', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/profile', label: 'Profile', icon: User },
];

const roleFilters: { label: string; value: UserRole | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'LHV', value: 'LHV' },
  { label: 'ANM', value: 'ANM' },
  { label: 'Pharmacist', value: 'PHARMACIST' },
  { label: 'Lab Tech', value: 'LAB_TECH' },
  { label: 'ASHA Sup.', value: 'ASHA_SUPERVISOR' },
];

const roleColors: Record<UserRole, string> = {
  LHV: 'bg-primary/10 text-primary',
  ANM: 'bg-secondary/10 text-secondary',
  ASHA_SUPERVISOR: 'bg-info/10 text-info',
  LAB_TECH: 'bg-warning/10 text-warning-foreground',
  PHARMACIST: 'bg-success/10 text-success',
  ADMIN: 'bg-foreground/10 text-foreground',
};

export default function StaffManagementPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const filteredStaff = mockStaffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleResetPassword = (staffId: string, name: string) => {
    toast.success('Password reset link sent', {
      description: `A password reset link has been sent to ${name}.`,
    });
  };

  const handleToggleStatus = (staffId: string, name: string, isActive: boolean) => {
    toast.success(isActive ? 'Staff deactivated' : 'Staff activated', {
      description: `${name} has been ${isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Staff Management"
        subtitle="Manage PHC staff accounts"
        action={
          <Button size="sm" onClick={() => navigate('/admin/staff/new')}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Role Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {roleFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setRoleFilter(filter.value)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                roleFilter === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Staff List */}
        <div className="space-y-3">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="rounded-xl bg-card p-4 shadow-card"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold',
                  roleColors[staff.role]
                )}>
                  {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground truncate">{staff.name}</p>
                    <StatusBadge
                      variant={staff.is_active ? 'active' : 'inactive'}
                      size="sm"
                    >
                      {staff.is_active ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      roleColors[staff.role]
                    )}>
                      {staff.role.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {staff.phone}
                  </div>
                  {staff.last_login && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last login: {format(new Date(staff.last_login), 'MMM d, h:mm a')}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/admin/staff/${staff.id}`)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/admin/staff/${staff.id}/edit`)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleResetPassword(staff.id, staff.name)}>
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(staff.id, staff.name, staff.is_active)}
                      className={staff.is_active ? 'text-destructive' : 'text-success'}
                    >
                      {staff.is_active ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mappings */}
              {(staff.sub_centres || staff.villages) && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex flex-wrap gap-1">
                    {staff.sub_centres?.map((sc) => (
                      <span
                        key={sc}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {sc}
                      </span>
                    ))}
                    {staff.villages?.map((v) => (
                      <span
                        key={v}
                        className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No staff found</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav items={navItems} />
    </AppShell>
  );
}
