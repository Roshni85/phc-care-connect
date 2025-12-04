import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { mockSubCentres } from '@/data/mockSurveys';
import {
  Home,
  ClipboardCheck,
  MapPin,
  FileText,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/surveys', label: 'Surveys', icon: ClipboardCheck },
  { path: '/visits', label: 'Visits', icon: MapPin },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function VisitsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showVisitDialog, setShowVisitDialog] = useState(false);
  const [selectedSubCentre, setSelectedSubCentre] = useState<typeof mockSubCentres[0] | null>(null);
  const [visitNotes, setVisitNotes] = useState('');

  const getVisitStatus = (lastVisit?: string) => {
    if (!lastVisit) return 'overdue';
    const days = differenceInDays(new Date(), new Date(lastVisit));
    if (days > 30) return 'overdue';
    if (days > 20) return 'due_soon';
    return 'recent';
  };

  const handleMarkVisit = () => {
    if (!selectedSubCentre) return;
    toast.success('Visit recorded successfully!', {
      description: `Visit to ${selectedSubCentre.name} has been recorded.`,
    });
    setShowVisitDialog(false);
    setVisitNotes('');
    setSelectedSubCentre(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Field Visits"
        subtitle="Sub-centre supervision & performance"
      />

      <div className="px-4 py-4 space-y-4">
        {mockSubCentres.map((sc) => {
          const visitStatus = getVisitStatus(sc.last_lhv_visit);
          const isExpanded = expandedId === sc.id;

          return (
            <div
              key={sc.id}
              className={cn(
                'rounded-xl bg-card shadow-card overflow-hidden transition-all',
                visitStatus === 'overdue' && 'border-l-4 border-l-destructive'
              )}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : sc.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{sc.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{sc.anm_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {visitStatus === 'overdue' && (
                      <StatusBadge variant="sent_back" dot={false}>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Overdue
                      </StatusBadge>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Last Visit Info */}
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {sc.last_lhv_visit ? (
                    <span>
                      Last visited: {format(new Date(sc.last_lhv_visit), 'MMM d, yyyy')}
                    </span>
                  ) : (
                    <span>Never visited</span>
                  )}
                </div>

                {/* Performance Score */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Performance Score</span>
                    <span className={cn(
                      'font-semibold',
                      sc.performance_score >= 80 ? 'text-success' :
                      sc.performance_score >= 60 ? 'text-warning' : 'text-destructive'
                    )}>
                      {sc.performance_score}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        sc.performance_score >= 80 ? 'bg-success' :
                        sc.performance_score >= 60 ? 'bg-warning' : 'bg-destructive'
                      )}
                      style={{ width: `${sc.performance_score}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                  {/* Performance Gaps */}
                  {sc.gaps.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Performance Gaps</p>
                      <ul className="space-y-1">
                        {sc.gaps.map((gap, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Villages */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Villages Covered</p>
                    <div className="flex flex-wrap gap-2">
                      {sc.villages.map((village) => (
                        <span
                          key={village}
                          className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                        >
                          {village}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedSubCentre(sc);
                      setShowVisitDialog(true);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Visit Completed
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visit Dialog */}
      <Dialog open={showVisitDialog} onOpenChange={setShowVisitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Supervisory Visit</DialogTitle>
            <DialogDescription>
              Add notes from your visit to {selectedSubCentre?.name}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g., Cold chain issue observed – informed MO. Reviewed registers and provided guidance on data entry."
            value={visitNotes}
            onChange={(e) => setVisitNotes(e.target.value)}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVisitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkVisit}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Record Visit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav items={navItems} />
    </AppShell>
  );
}
