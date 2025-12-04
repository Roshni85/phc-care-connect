import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageHeader } from '@/components/ui/page-header';
import { Switch } from '@/components/ui/switch';
import { mockProgrammeModules, mockPHCInfo } from '@/data/mockAdmin';
import {
  Home,
  Users,
  Settings,
  User,
  Layers,
  Building,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/admin/staff', label: 'Staff', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function AdminSettingsPage() {
  const [modules, setModules] = useState(mockProgrammeModules);

  const handleToggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === moduleId) {
          const newState = !m.is_enabled;
          toast.success(`Module ${newState ? 'enabled' : 'disabled'}`, {
            description: `${m.name} has been ${newState ? 'enabled' : 'disabled'}.`,
          });
          return { ...m, is_enabled: newState };
        }
        return m;
      })
    );
  };

  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="PHC configuration and modules" />

      <div className="px-4 py-4 space-y-6">
        {/* PHC Information */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Building className="h-4 w-4" />
            PHC Information
          </h2>
          <div className="rounded-xl bg-card p-4 shadow-card space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">PHC Name</p>
              <p className="font-medium text-foreground">{mockPHCInfo.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">District</p>
                <p className="font-medium text-foreground">{mockPHCInfo.district}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">State</p>
                <p className="font-medium text-foreground">{mockPHCInfo.state}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Centres */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Sub-Centres & Villages
          </h2>
          <div className="space-y-3">
            {mockPHCInfo.sub_centres.map((sc) => (
              <div key={sc.id} className="rounded-xl bg-card p-4 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{sc.name}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {sc.villages.map((v) => (
                    <span
                      key={v.id}
                      className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                    >
                      {v.name} ({v.population.toLocaleString()})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Programme Modules */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Programme Modules
          </h2>
          <div className="rounded-xl bg-card shadow-card divide-y divide-border">
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium text-foreground">{module.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {module.description}
                  </p>
                </div>
                <Switch
                  checked={module.is_enabled}
                  onCheckedChange={() => handleToggleModule(module.id)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav items={navItems} />
    </AppShell>
  );
}
