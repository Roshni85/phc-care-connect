export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  unit: string;
  total_stock: number;
  minimum_required: number;
  batches: MedicineBatch[];
}

export interface MedicineBatch {
  id: string;
  medicine_id: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  received_date: string;
}

export interface MedicineIssuance {
  id: string;
  patient_id: string;
  patient_name: string;
  opd_slip_no: string;
  medicines: IssuedMedicine[];
  issued_at: string;
  issued_by: string;
}

export interface IssuedMedicine {
  medicine_id: string;
  medicine_name: string;
  quantity: number;
  batch_id: string;
}

export interface Prescription {
  patient_id: string;
  patient_name: string;
  opd_slip_no: string;
  medicines: PrescribedMedicine[];
}

export interface PrescribedMedicine {
  medicine_id: string;
  medicine_name: string;
  dosage: string;
  quantity: number;
}
