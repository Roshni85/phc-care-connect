import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import {
  Home,
  ClipboardCheck,
  MapPin,
  FileText,
  User,
  Download,
  Send,
  Calendar,
  TrendingUp,
  Baby,
  Syringe,
  HeartPulse,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/surveys', label: 'Surveys', icon: ClipboardCheck },
  { path: '/visits', label: 'Visits', icon: MapPin },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/profile', label: 'Profile', icon: User },
];

const programmes = ['All Programmes', 'RMNCH+A', 'NCD', 'TB', 'Immunization'];
const months = [
  'January 2024',
  'December 2023',
  'November 2023',
  'October 2023',
];

// Mock report data
const reportData = {
  rmnch: {
    anc_registered: 156,
    anc_4_plus: 142,
    institutional_deliveries: 48,
    home_deliveries: 2,
    pnc_within_48hrs: 47,
  },
  immunization: {
    bcg: 52,
    opv3: 48,
    pentavalent3: 48,
    measles1: 45,
    full_immunization: 44,
  },
  ncd: {
    screened_30_plus: 1250,
    high_bp_detected: 145,
    diabetes_detected: 89,
    referrals: 34,
  },
};

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState('January 2024');
  const [selectedProgramme, setSelectedProgramme] = useState('All Programmes');

  const handleExportPDF = () => {
    toast.success('Report exported as PDF', {
      description: 'The report has been downloaded to your device.',
    });
  };

  const handleSubmitReport = () => {
    toast.success('Report submitted to MO', {
      description: 'The monthly report has been submitted for review.',
    });
  };

  return (
    <AppShell>
      <PageHeader title="Monthly Reports" subtitle="NHP programme reports" />

      <div className="px-4 py-4 space-y-6">
        {/* Filters */}
        <div className="flex gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="flex-1 bg-card">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedProgramme} onValueChange={setSelectedProgramme}>
            <SelectTrigger className="flex-1 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {programmes.map((prog) => (
                <SelectItem key={prog} value={prog}>
                  {prog}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* RMNCH+A Section */}
        {(selectedProgramme === 'All Programmes' || selectedProgramme === 'RMNCH+A') && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/20">
                <Baby className="h-4 w-4 text-secondary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">RMNCH+A</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                title="ANC Registered"
                value={reportData.rmnch.anc_registered}
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="ANC 4+ Visits"
                value={reportData.rmnch.anc_4_plus}
                subtitle={`${Math.round((reportData.rmnch.anc_4_plus / reportData.rmnch.anc_registered) * 100)}% coverage`}
              />
              <StatCard
                title="Institutional Deliveries"
                value={reportData.rmnch.institutional_deliveries}
              />
              <StatCard
                title="PNC within 48hrs"
                value={reportData.rmnch.pnc_within_48hrs}
              />
            </div>
          </section>
        )}

        {/* Immunization Section */}
        {(selectedProgramme === 'All Programmes' || selectedProgramme === 'Immunization') && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/20">
                <Syringe className="h-4 w-4 text-info" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Immunization</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard title="BCG" value={reportData.immunization.bcg} />
              <StatCard title="OPV-3" value={reportData.immunization.opv3} />
              <StatCard title="Pentavalent-3" value={reportData.immunization.pentavalent3} />
              <StatCard
                title="Full Immunization"
                value={reportData.immunization.full_immunization}
                trend={{ value: 5, isPositive: true }}
              />
            </div>
          </section>
        )}

        {/* NCD Section */}
        {(selectedProgramme === 'All Programmes' || selectedProgramme === 'NCD') && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/20">
                <HeartPulse className="h-4 w-4 text-destructive" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">NCD Screening</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                title="Screened (30+)"
                value={reportData.ncd.screened_30_plus}
                trend={{ value: 8, isPositive: true }}
              />
              <StatCard title="High BP Detected" value={reportData.ncd.high_bp_detected} />
              <StatCard title="Diabetes Detected" value={reportData.ncd.diabetes_detected} />
              <StatCard title="Referrals Made" value={reportData.ncd.referrals} />
            </div>
          </section>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button className="flex-1" onClick={handleSubmitReport}>
            <Send className="h-4 w-4 mr-2" />
            Submit to MO
          </Button>
        </div>
      </div>

      <BottomNav items={navItems} />
    </AppShell>
  );
}
