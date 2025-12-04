import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { StatCard } from '@/components/ui/stat-card';
import { ActionCard } from '@/components/ui/action-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockMedicines } from '@/data/mockPharmacy';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Pill,
  Package,
  AlertTriangle,
  User,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/pharmacy/issue', label: 'Issue', icon: Pill },
  { path: '/pharmacy/stock', label: 'Stock', icon: Package },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const lowStockMedicines = mockMedicines.filter(
    (m) => m.total_stock < m.minimum_required
  );
  const expiringMedicines = mockMedicines.filter((m) =>
    m.batches.some((b) => {
      const expiry = new Date(b.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
    })
  );

  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <AppShell>
      {/* Header */}
      <header className="bg-gradient-to-br from-secondary to-secondary/90 text-secondary-foreground px-4 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-secondary-foreground/70 text-sm">{today}</p>
            <h1 className="text-xl font-bold mt-1">Hello, {user?.name.split(' ')[0]}!</h1>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/20 transition-colors">
            <Bell className="h-5 w-5" />
            {lowStockMedicines.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {lowStockMedicines.length}
              </span>
            )}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-secondary-foreground/10 p-4">
            <p className="text-secondary-foreground/70 text-xs">Low Stock Items</p>
            <p className="text-2xl font-bold mt-1">{lowStockMedicines.length}</p>
          </div>
          <div className="rounded-xl bg-secondary-foreground/10 p-4">
            <p className="text-secondary-foreground/70 text-xs">Expiring Soon</p>
            <p className="text-2xl font-bold mt-1">{expiringMedicines.length}</p>
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
              title="Issue Medicines"
              description="Dispense medicines to patients"
              icon={Pill}
              onClick={() => navigate('/pharmacy/issue')}
            />
            <ActionCard
              title="View Stock"
              description="Check inventory and batch details"
              icon={Package}
              onClick={() => navigate('/pharmacy/stock')}
            />
            <ActionCard
              title="Low Stock Alerts"
              description="Items below minimum level"
              icon={AlertTriangle}
              badge={lowStockMedicines.length}
              badgeVariant="destructive"
              onClick={() => navigate('/pharmacy/stock?filter=low')}
            />
          </div>
        </section>

        {/* Low Stock Items */}
        {lowStockMedicines.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Low Stock Alert
              </h2>
              <button
                onClick={() => navigate('/pharmacy/stock?filter=low')}
                className="text-sm text-primary font-medium flex items-center gap-1"
              >
                View all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {lowStockMedicines.slice(0, 3).map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-card border-l-4 border-l-destructive"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{medicine.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: <span className="text-destructive font-medium">{medicine.total_stock}</span>
                      {' / '}
                      Min: {medicine.minimum_required}
                    </p>
                  </div>
                  <StatusBadge variant="low_stock">Low</StatusBadge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Issuances */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Today's Statistics
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Prescriptions"
              value={24}
              subtitle="Processed today"
              icon={Pill}
            />
            <StatCard
              title="Medicines Issued"
              value={156}
              subtitle="Units dispensed"
              icon={Package}
            />
          </div>
        </section>
      </div>

      <BottomNav items={navItems} />
    </AppShell>
  );
}
