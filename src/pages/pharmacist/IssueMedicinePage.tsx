import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockMedicines, mockPrescription } from '@/data/mockPharmacy';
import {
  Home,
  Pill,
  Package,
  User,
  Search,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/pharmacy/issue', label: 'Issue', icon: Pill },
  { path: '/pharmacy/stock', label: 'Stock', icon: Package },
  { path: '/profile', label: 'Profile', icon: User },
];

interface MedicineToIssue {
  medicine_id: string;
  medicine_name: string;
  quantity: number;
  max_quantity: number;
  prescribed_quantity: number;
}

export default function IssueMedicinePage() {
  const [patientId, setPatientId] = useState('');
  const [prescription, setPrescription] = useState<typeof mockPrescription | null>(null);
  const [medicinesToIssue, setMedicinesToIssue] = useState<MedicineToIssue[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!patientId.trim()) {
      toast.error('Please enter a Patient ID or OPD Slip No.');
      return;
    }

    setIsSearching(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock: Return prescription for demo
    if (patientId.toLowerCase().includes('opd') || patientId.toLowerCase().includes('pat')) {
      setPrescription(mockPrescription);
      setMedicinesToIssue(
        mockPrescription.medicines.map((med) => {
          const stockMedicine = mockMedicines.find((m) => m.id === med.medicine_id);
          return {
            medicine_id: med.medicine_id,
            medicine_name: med.medicine_name,
            quantity: med.quantity,
            max_quantity: stockMedicine?.total_stock || 0,
            prescribed_quantity: med.quantity,
          };
        })
      );
    } else {
      toast.error('No prescription found', {
        description: 'Please check the Patient ID or OPD Slip No.',
      });
    }
    setIsSearching(false);
  };

  const updateQuantity = (medicineId: string, delta: number) => {
    setMedicinesToIssue((prev) =>
      prev.map((m) => {
        if (m.medicine_id === medicineId) {
          const newQty = Math.max(0, Math.min(m.max_quantity, m.quantity + delta));
          return { ...m, quantity: newQty };
        }
        return m;
      })
    );
  };

  const handleIssue = () => {
    const hasItems = medicinesToIssue.some((m) => m.quantity > 0);
    if (!hasItems) {
      toast.error('Please select at least one medicine to issue');
      return;
    }

    toast.success('Medicines issued successfully!', {
      description: `Issued to ${prescription?.patient_name}`,
    });

    // Reset form
    setPatientId('');
    setPrescription(null);
    setMedicinesToIssue([]);
  };

  return (
    <AppShell>
      <PageHeader title="Issue Medicines" subtitle="Dispense medicines to patients" />

      <div className="px-4 py-4 space-y-6">
        {/* Search Section */}
        <div className="space-y-3">
          <Label htmlFor="patientId">Patient ID / OPD Slip No.</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="patientId"
                placeholder="Enter ID or scan barcode..."
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="pl-10 bg-card"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Try: "OPD-2024-0125" or "PAT-001" for demo
          </p>
        </div>

        {/* Prescription Details */}
        {prescription && (
          <>
            <div className="rounded-xl bg-card p-4 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{prescription.patient_name}</p>
                  <p className="text-sm text-muted-foreground">{prescription.opd_slip_no}</p>
                </div>
              </div>
            </div>

            {/* Medicines List */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Prescribed Medicines
              </h2>
              <div className="space-y-3">
                {medicinesToIssue.map((medicine) => {
                  const isLowStock = medicine.max_quantity < medicine.prescribed_quantity;
                  const prescribedMed = prescription.medicines.find(
                    (m) => m.medicine_id === medicine.medicine_id
                  );

                  return (
                    <div
                      key={medicine.medicine_id}
                      className={cn(
                        'rounded-xl bg-card p-4 shadow-card',
                        isLowStock && 'border border-warning'
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{medicine.medicine_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Dosage: {prescribedMed?.dosage}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Prescribed: {medicine.prescribed_quantity} | Stock: {medicine.max_quantity}
                          </p>
                        </div>
                        {isLowStock && (
                          <div className="flex items-center gap-1 text-warning text-xs">
                            <AlertCircle className="h-3 w-3" />
                            Low Stock
                          </div>
                        )}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Quantity to Issue:</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(medicine.medicine_id, -1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            disabled={medicine.quantity <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-semibold text-foreground">
                            {medicine.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(medicine.medicine_id, 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            disabled={medicine.quantity >= medicine.max_quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Issue Button */}
            <Button className="w-full h-12 text-base" onClick={handleIssue}>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Issue Medicines
            </Button>
          </>
        )}

        {/* Empty State */}
        {!prescription && (
          <div className="text-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Search for a patient to view their prescription
            </p>
          </div>
        )}
      </div>

      <BottomNav items={navItems} />
    </AppShell>
  );
}
