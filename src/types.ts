export interface PaymentRecord {
  id: string;
  clientId: string;
  amount: number;
  date: Date;
  note?: string;
}

export interface Client {
  id?: string;
  name: string;
  phone: string;
  address?: string;
  totalDebt: number;
  paymentHistory: PaymentRecord[];
}

export interface InvoiceItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
}

// Helper to calculate total price for an item
export const calculateItemTotal = (item: InvoiceItem): number => {
  return item.quantity * item.unitPrice;
};

export enum PaymentStatus {
  PAID = 'paid',
  DEBT = 'debt',
  PARTIAL = 'partial',
}

export enum Currency {
  USD = 'usd',
  EUR = 'eur',
  TRY = 'try',
}

export interface StoreSettings {
  name: string;
  phone: string;
  address: string;
  logoBase64?: string;
}

export interface Invoice {
  id?: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientAddress?: string;
  date: Date;
  items: InvoiceItem[];
  paidAmount: number;
  status: PaymentStatus;
  currency: Currency;
  discountValue: number;
  discountType: 'fixed' | 'percentage';
  packagingFee: number;
  previousDebt: number; // Added to capture debt at invoice time
  note?: string; // Message to customer
}

// Helper to calculate total invoice amount
export const calculateInvoiceTotal = (invoice: Invoice): number => {
  const itemsTotal = (invoice.items || []).reduce((sum, item) => sum + calculateItemTotal(item), 0);
  return itemsTotal + (invoice.packagingFee || 0);
};

// Helper to calculate remaining invoice amount
export const calculateInvoiceRemaining = (invoice: Invoice): number => {
  return calculateInvoiceTotal(invoice) + invoice.previousDebt - invoice.paidAmount;
};
