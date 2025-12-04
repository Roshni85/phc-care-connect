import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockSurveyBatches } from '@/data/mockSurveys';
import { SurveyStatus, ProgrammeType } from '@/types/survey';
import {
  Home,
  ClipboardCheck,
  MapPin,
  FileText,
  User,
  Filter,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/surveys', label: 'Surveys', icon: ClipboardCheck },
  { path: '/visits', label: 'Visits', icon: MapPin },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/profile', label: 'Profile', icon: User },
];

const statusFilters: { label: string; value: SurveyStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Verified', value: 'verified' },
  { label: 'Sent Back', value: 'sent_back' },
];

export default function SurveyListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SurveyStatus | 'all'>('all');

  const filteredSurveys = mockSurveyBatches.filter((survey) => {
    const matchesSearch =
      survey.batch_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.anm_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.village.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group by programme
  const groupedByProgramme = filteredSurveys.reduce((acc, survey) => {
    if (!acc[survey.programme]) {
      acc[survey.programme] = [];
    }
    acc[survey.programme].push(survey);
    return acc;
  }, {} as Record<ProgrammeType, typeof filteredSurveys>);

  return (
    <AppShell>
      <PageHeader
        title="Survey Verification"
        subtitle="Review and verify submitted surveys"
      />

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by batch ID, ANM, or village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                statusFilter === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Survey List Grouped by Programme */}
        <div className="space-y-6">
          {Object.entries(groupedByProgramme).map(([programme, surveys]) => (
            <section key={programme}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-xs font-bold">
                  {programme.slice(0, 2)}
                </span>
                {programme}
                <span className="text-xs font-normal">({surveys.length})</span>
              </h3>
              <div className="space-y-3">
                {surveys.map((survey) => (
                  <button
                    key={survey.id}
                    onClick={() => navigate(`/surveys/${survey.id}`)}
                    className="w-full rounded-xl bg-card p-4 shadow-card text-left hover:shadow-elevated transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{survey.batch_id}</p>
                          <StatusBadge variant={survey.status}>
                            {survey.status.replace('_', ' ')}
                          </StatusBadge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {survey.anm_name} • {survey.village}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                    </div>

                    {/* Indicators */}
                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{survey.total_households}</p>
                        <p className="text-[10px] text-muted-foreground">Households</p>
                      </div>
                      {survey.programme === 'ANC' || survey.programme === 'RMNCH' ? (
                        <div className="text-center">
                          <p className="text-lg font-bold text-success">{survey.indicators.anc_4_plus}</p>
                          <p className="text-[10px] text-muted-foreground">ANC 4+</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">{survey.indicators.high_bp_count}</p>
                          <p className="text-[10px] text-muted-foreground">High BP</p>
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">{survey.indicators.immunization_complete}</p>
                        <p className="text-[10px] text-muted-foreground">Immunized</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-warning">{survey.indicators.referrals}</p>
                        <p className="text-[10px] text-muted-foreground">Referrals</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}

          {filteredSurveys.length === 0 && (
            <div className="text-center py-12">
              <ClipboardCheck className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No surveys found</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav items={navItems} />
    </AppShell>
  );
}
