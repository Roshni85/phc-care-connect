import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatCard } from '@/components/ui/stat-card';
import { ActionCard } from '@/components/ui/action-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockSurveyBatches, mockSubCentres } from '@/data/mockSurveys';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ClipboardCheck,
  MapPin,
  FileText,
  User,
  ClipboardList,
  Users,
  Calendar,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/surveys', label: 'Surveys', icon: ClipboardCheck },
  { path: '/visits', label: 'Visits', icon: MapPin },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function LHVDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const pendingSurveys = mockSurveyBatches.filter(
    (s) => s.status === 'new' || s.status === 'in_review'
  );
  const subCentresNotVisited = mockSubCentres.filter(
    (sc) => !sc.last_lhv_visit || new Date(sc.last_lhv_visit) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <AppShell>
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/70 text-sm">{today}</p>
            <h1 className="text-xl font-bold mt-1">Hello, {user?.name.split(' ')[0]}!</h1>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold">
              3
            </span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-primary-foreground/10 p-4">
            <p className="text-primary-foreground/70 text-xs">Pending Surveys</p>
            <p className="text-2xl font-bold mt-1">{pendingSurveys.length}</p>
          </div>
          <div className="rounded-xl bg-primary-foreground/10 p-4">
            <p className="text-primary-foreground/70 text-xs">Due Visits</p>
            <p className="text-2xl font-bold mt-1">{subCentresNotVisited.length}</p>
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
              title="Verify Surveys"
              description="Review and approve submitted surveys"
              icon={ClipboardCheck}
              badge={pendingSurveys.length}
              badgeVariant="warning"
              onClick={() => navigate('/surveys')}
            />
            <ActionCard
              title="View ANM/ASHA Performance"
              description="Track field staff performance metrics"
              icon={Users}
              onClick={() => navigate('/visits')}
            />
            <ActionCard
              title="Generate Monthly Report"
              description="Create NHP reports for submission"
              icon={FileText}
              onClick={() => navigate('/reports')}
            />
          </div>
        </section>

        {/* Pending Surveys Preview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Recent Pending Surveys
            </h2>
            <button
              onClick={() => navigate('/surveys')}
              className="text-sm text-primary font-medium flex items-center gap-1"
            >
              View all <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {pendingSurveys.slice(0, 3).map((survey) => (
              <button
                key={survey.id}
                onClick={() => navigate(`/surveys/${survey.id}`)}
                className="w-full flex items-center gap-4 rounded-xl bg-card p-4 shadow-card text-left hover:shadow-elevated transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground font-semibold text-sm">
                  {survey.programme.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">{survey.batch_id}</p>
                    <StatusBadge variant={survey.status}>{survey.status.replace('_', ' ')}</StatusBadge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {survey.anm_name} • {survey.village}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        {/* Upcoming VHNDs */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Upcoming VHNDs
          </h2>
          <div className="rounded-xl bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <span className="text-lg font-bold">18</span>
                <span className="text-[10px] -mt-1">JAN</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">VHND - Rampur</p>
                <p className="text-sm text-muted-foreground">Sub-Centre A • 9:00 AM</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </section>
      </div>

      <BottomNav items={navItems} />
    </AppShell>
  );
}
