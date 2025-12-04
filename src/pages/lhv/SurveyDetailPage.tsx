import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { mockSurveyBatches, mockHouseholdSurveys } from '@/data/mockSurveys';
import {
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  Users,
  Calendar,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function SurveyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSendBackDialog, setShowSendBackDialog] = useState(false);
  const [sendBackComment, setSendBackComment] = useState('');

  const survey = mockSurveyBatches.find((s) => s.id === id);

  if (!survey) {
    return (
      <AppShell hasBottomNav={false}>
        <PageHeader title="Survey Not Found" showBack backPath="/surveys" />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Survey not found</p>
        </div>
      </AppShell>
    );
  }

  const handleVerify = () => {
    toast.success('Survey verified successfully!', {
      description: 'The survey has been marked as verified.',
    });
    navigate('/surveys');
  };

  const handleSendBack = () => {
    if (!sendBackComment.trim()) {
      toast.error('Please provide a reason for sending back');
      return;
    }
    toast.success('Survey sent back to ANM', {
      description: 'The ANM will be notified to make corrections.',
    });
    setShowSendBackDialog(false);
    navigate('/surveys');
  };

  return (
    <AppShell hasBottomNav={false}>
      <PageHeader
        title={survey.batch_id}
        subtitle={`${survey.programme} Survey`}
        showBack
        backPath="/surveys"
      />

      <div className="px-4 py-4 space-y-6">
        {/* Status & Info */}
        <div className="rounded-xl bg-card p-4 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <StatusBadge variant={survey.status} size="lg">
              {survey.status.replace('_', ' ')}
            </StatusBadge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(survey.submitted_at), 'MMM d, yyyy')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{survey.anm_name}</p>
                <p className="text-xs text-muted-foreground">ANM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <MapPin className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{survey.village}</p>
                <p className="text-xs text-muted-foreground">{survey.sub_centre}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Indicators */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Key Indicators
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-card p-4 shadow-card">
              <p className="text-2xl font-bold text-foreground">{survey.total_households}</p>
              <p className="text-sm text-muted-foreground">Total Households</p>
            </div>
            <div className="rounded-xl bg-card p-4 shadow-card">
              <p className="text-2xl font-bold text-success">{survey.indicators.anc_4_plus}</p>
              <p className="text-sm text-muted-foreground">ANC 4+ Visits</p>
            </div>
            <div className="rounded-xl bg-card p-4 shadow-card">
              <p className="text-2xl font-bold text-foreground">{survey.indicators.immunization_complete}</p>
              <p className="text-sm text-muted-foreground">Immunization Complete</p>
            </div>
            <div className="rounded-xl bg-card p-4 shadow-card">
              <p className="text-2xl font-bold text-warning">{survey.indicators.high_bp_count}</p>
              <p className="text-sm text-muted-foreground">High BP Cases</p>
            </div>
          </div>
        </section>

        {/* Household Forms */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Household Forms ({mockHouseholdSurveys.length})
          </h2>
          <div className="space-y-3">
            {mockHouseholdSurveys.map((household) => (
              <div
                key={household.id}
                className={cn(
                  'rounded-xl bg-card p-4 shadow-card',
                  household.has_issues && 'border-l-4 border-l-warning'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{household.head_name}</p>
                      {household.has_issues && (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {household.household_id} • {household.members_count} members
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {household.has_issues && household.issues && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-warning font-medium">Issues Found:</p>
                    <ul className="mt-1 space-y-1">
                      {household.issues.map((issue, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">
                          • {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      {(survey.status === 'new' || survey.status === 'in_review') && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowSendBackDialog(true)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Send Back
          </Button>
          <Button className="flex-1" onClick={handleVerify}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Verify
          </Button>
        </div>
      )}

      {/* Send Back Dialog */}
      <Dialog open={showSendBackDialog} onOpenChange={setShowSendBackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Back Survey</DialogTitle>
            <DialogDescription>
              Please provide a reason for sending this survey back to the ANM/ASHA.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g., Missing BP reading for 3 households"
            value={sendBackComment}
            onChange={(e) => setSendBackComment(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendBackDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendBack}>Send Back</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
