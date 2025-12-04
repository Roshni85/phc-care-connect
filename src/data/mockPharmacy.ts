import { Medicine, Prescription } from '@/types/pharmacy';

export const mockMedicines: Medicine[] = [
  {
    id: 'med-001',
    name: 'Paracetamol 500mg',
    generic_name: 'Paracetamol',
    category: 'Analgesic',
    unit: 'Tablet',
    total_stock: 2500,
    minimum_required: 500,
    batches: [
      {
        id: 'batch-001',
        medicine_id: 'med-001',
        batch_number: 'PCM-2024-A1',
        quantity: 1500,
        expiry_date: '2025-06-15',
        received_date: '2024-01-01',
      },
      {
        id: 'batch-002',
        medicine_id: 'med-001',
        batch_number: 'PCM-2024-A2',
        quantity: 1000,
        expiry_date: '2025-08-20',
        received_date: '2024-01-10',
      },
    ],
  },
  {
    id: 'med-002',
    name: 'Amoxicillin 250mg',
    generic_name: 'Amoxicillin',
    category: 'Antibiotic',
    unit: 'Capsule',
    total_stock: 800,
    minimum_required: 300,
    batches: [
      {
        id: 'batch-003',
        medicine_id: 'med-002',
        batch_number: 'AMX-2024-B1',
        quantity: 800,
        expiry_date: '2024-12-31',
        received_date: '2024-01-05',
      },
    ],
  },
  {
    id: 'med-003',
    name: 'ORS Sachets',
    generic_name: 'Oral Rehydration Salts',
    category: 'Rehydration',
    unit: 'Sachet',
    total_stock: 150,
    minimum_required: 200,
    batches: [
      {
        id: 'batch-004',
        medicine_id: 'med-003',
        batch_number: 'ORS-2024-C1',
        quantity: 150,
        expiry_date: '2025-03-10',
        received_date: '2024-01-08',
      },
    ],
  },
  {
    id: 'med-004',
    name: 'Amlodipine 5mg',
    generic_name: 'Amlodipine',
    category: 'Antihypertensive',
    unit: 'Tablet',
    total_stock: 1200,
    minimum_required: 400,
    batches: [
      {
        id: 'batch-005',
        medicine_id: 'med-004',
        batch_number: 'AML-2024-D1',
        quantity: 1200,
        expiry_date: '2025-09-25',
        received_date: '2024-01-12',
      },
    ],
  },
  {
    id: 'med-005',
    name: 'Metformin 500mg',
    generic_name: 'Metformin',
    category: 'Antidiabetic',
    unit: 'Tablet',
    total_stock: 950,
    minimum_required: 350,
    batches: [
      {
        id: 'batch-006',
        medicine_id: 'med-005',
        batch_number: 'MET-2024-E1',
        quantity: 950,
        expiry_date: '2025-07-18',
        received_date: '2024-01-03',
      },
    ],
  },
  {
    id: 'med-006',
    name: 'Iron + Folic Acid',
    generic_name: 'Ferrous Sulphate + Folic Acid',
    category: 'Supplement',
    unit: 'Tablet',
    total_stock: 80,
    minimum_required: 500,
    batches: [
      {
        id: 'batch-007',
        medicine_id: 'med-006',
        batch_number: 'IFA-2024-F1',
        quantity: 80,
        expiry_date: '2024-04-30',
        received_date: '2023-12-15',
      },
    ],
  },
];

export const mockPrescription: Prescription = {
  patient_id: 'PAT-001',
  patient_name: 'Ramesh Kumar',
  opd_slip_no: 'OPD-2024-0125',
  medicines: [
    {
      medicine_id: 'med-001',
      medicine_name: 'Paracetamol 500mg',
      dosage: '1 tablet 3 times a day',
      quantity: 15,
    },
    {
      medicine_id: 'med-002',
      medicine_name: 'Amoxicillin 250mg',
      dosage: '1 capsule 2 times a day',
      quantity: 10,
    },
  ],
};
