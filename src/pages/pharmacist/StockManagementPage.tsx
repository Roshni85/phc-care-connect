import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockMedicines } from '@/data/mockPharmacy';
import {
  Home,
  Pill,
  Package,
  User,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertTriangle,
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
import { Label } from '@/components/ui/label';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/pharmacy/issue', label: 'Issue', icon: Pill },
  { path: '/pharmacy/stock', label: 'Stock', icon: Package },
  { path: '/profile', label: 'Profile', icon: User },
];

const stockFilters = [
  { label: 'All', value: 'all' },
  { label: 'Low Stock', value: 'low' },
  { label: 'Expiring', value: 'expiring' },
];

export default function StockManagementPage() {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState(initialFilter);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddBatchDialog, setShowAddBatchDialog] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<typeof mockMedicines[0] | null>(null);

  // New batch form state
  const [newBatch, setNewBatch] = useState({
    batch_number: '',
    quantity: '',
    expiry_date: '',
  });

  const filteredMedicines = mockMedicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.generic_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (stockFilter === 'low') {
      return matchesSearch && medicine.total_stock < medicine.minimum_required;
    }
    if (stockFilter === 'expiring') {
      return (
        matchesSearch &&
        medicine.batches.some((b) => {
          const days = differenceInDays(new Date(b.expiry_date), new Date());
          return days <= 90 && days > 0;
        })
      );
    }
    return matchesSearch;
  });

  const getStockStatus = (medicine: typeof mockMedicines[0]) => {
    if (medicine.total_stock < medicine.minimum_required) return 'low_stock';
    return 'active';
  };

  const getBatchStatus = (expiryDate: string) => {
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days <= 0) return 'expired';
    if (days <= 30) return 'critical';
    if (days <= 90) return 'expiring';
    return 'good';
  };

  const handleAddBatch = () => {
    if (!newBatch.batch_number || !newBatch.quantity || !newBatch.expiry_date) {
      toast.error('Please fill all fields');
      return;
    }

    toast.success('Batch added successfully!', {
      description: `Added ${newBatch.quantity} units of ${selectedMedicine?.name}`,
    });
    setShowAddBatchDialog(false);
    setNewBatch({ batch_number: '', quantity: '', expiry_date: '' });
    setSelectedMedicine(null);
  };

  return (
    <AppShell>
      <PageHeader title="Stock Management" subtitle="Inventory and batch details" />

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {stockFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStockFilter(filter.value)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                stockFilter === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Medicine List */}
        <div className="space-y-3">
          {filteredMedicines.map((medicine) => {
            const isExpanded = expandedId === medicine.id;
            const stockStatus = getStockStatus(medicine);

            return (
              <div
                key={medicine.id}
                className={cn(
                  'rounded-xl bg-card shadow-card overflow-hidden',
                  stockStatus === 'low_stock' && 'border-l-4 border-l-destructive'
                )}
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : medicine.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{medicine.name}</p>
                        <StatusBadge
                          variant={stockStatus}
                          size="sm"
                        >
                          {stockStatus === 'low_stock' ? 'Low' : 'OK'}
                        </StatusBadge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {medicine.generic_name} • {medicine.category}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Stock Info */}
                  <div className="flex items-center gap-4 mt-3">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{medicine.total_stock}</p>
                      <p className="text-xs text-muted-foreground">In Stock</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div>
                      <p className="text-lg font-semibold text-muted-foreground">
                        {medicine.minimum_required}
                      </p>
                      <p className="text-xs text-muted-foreground">Min Required</p>
                    </div>
                  </div>
                </button>

                {/* Expanded Content - Batch Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">Batch Details</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMedicine(medicine);
                          setShowAddBatchDialog(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Batch
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {medicine.batches.map((batch) => {
                        const batchStatus = getBatchStatus(batch.expiry_date);
                        return (
                          <div
                            key={batch.id}
                            className={cn(
                              'rounded-lg bg-muted/50 p-3',
                              batchStatus === 'critical' && 'bg-destructive/10',
                              batchStatus === 'expiring' && 'bg-warning/10'
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-foreground">
                                {batch.batch_number}
                              </span>
                              <span className="text-sm font-semibold text-foreground">
                                {batch.quantity} {medicine.unit}s
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Expires: {format(new Date(batch.expiry_date), 'MMM d, yyyy')}
                              </span>
                              {batchStatus !== 'good' && (
                                <span
                                  className={cn(
                                    'ml-auto flex items-center gap-1',
                                    batchStatus === 'critical' && 'text-destructive',
                                    batchStatus === 'expiring' && 'text-warning'
                                  )}
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  {batchStatus === 'critical' ? 'Expiring soon!' : 'Expiring in 3 months'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredMedicines.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No medicines found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Batch Dialog */}
      <Dialog open={showAddBatchDialog} onOpenChange={setShowAddBatchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Batch</DialogTitle>
            <DialogDescription>
              Add a new batch for {selectedMedicine?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batch_number">Batch Number</Label>
              <Input
                id="batch_number"
                placeholder="e.g., PCM-2024-B3"
                value={newBatch.batch_number}
                onChange={(e) => setNewBatch({ ...newBatch, batch_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={newBatch.quantity}
                onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={newBatch.expiry_date}
                onChange={(e) => setNewBatch({ ...newBatch, expiry_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBatchDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBatch}>Add Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav items={navItems} />
    </AppShell>
  );
}
