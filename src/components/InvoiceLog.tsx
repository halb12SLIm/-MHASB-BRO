import { Invoice, calculateInvoiceTotal, PaymentStatus, StoreSettings, Client } from '../types';
import { printHighResInvoice } from '../utils/pdfGenerator';
import { shareInvoiceToWhatsApp } from '../utils/whatsappGenerator';
import { Printer, MessageSquare } from 'lucide-react';

interface Props {
  invoices: Invoice[];
  clients: Client[];
  storeSettings: StoreSettings;
}

export default function InvoiceLog({ invoices, clients, storeSettings }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">سجل الفواتير</h2>
      <div className="bg-white rounded-lg shadow-sm border border-[var(--color-secondary)] overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-[var(--color-secondary)] text-white border-b">
            <tr>
              <th className="p-3">التاريخ</th>
              <th className="p-3">العميل</th>
              <th className="p-3">الإجمالي</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const client = clients.find(c => c.id === inv.clientId) || { name: inv.clientName, phone: '' } as Client;
              return (
              <tr key={inv.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{inv.date.toLocaleDateString('ar-SA')}</td>
                <td className="p-3">{inv.clientName}</td>
                <td className="p-3">{calculateInvoiceTotal(inv).toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${inv.status === PaymentStatus.PAID ? 'bg-green-100 text-green-800' : 'bg-[var(--color-accent)] text-white'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                    <button onClick={() => printHighResInvoice(inv, storeSettings)} className="text-[var(--color-primary)]">
                        <Printer size={20} />
                    </button>
                    <button onClick={() => shareInvoiceToWhatsApp(inv, client)} className="text-green-600">
                        <MessageSquare size={20} />
                    </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
