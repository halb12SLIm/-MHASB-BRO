import { useState } from 'react';
import { Client, Invoice, PaymentRecord, calculateInvoiceTotal, calculateInvoiceRemaining, PaymentStatus, StoreSettings } from '../types';
import { DollarSign, Plus, FileText, CheckCircle, Printer, MessageSquare } from 'lucide-react';
import { printInvoice } from '../utils/pdfGenerator';
import { shareInvoiceToWhatsApp } from '../utils/whatsappGenerator';

interface Props {
  client: Client;
  invoices: Invoice[];
  storeSettings: StoreSettings;
  onAddPayment: (clientId: string, amount: number, note: string) => void;
  onBack: () => void;
}

export default function ClientProfile({ client, invoices, storeSettings, onAddPayment, onBack }: Props) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [note, setNote] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const clientInvoices = invoices.filter(inv => inv.clientId === client.id);

  const submitPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) return;
    
    onAddPayment(client.id!, amount, note);
    setToast(`تم حفظ الدفعة بنجاح! المبلغ المسدد: ${amount.toFixed(2)}`);
    setPaymentAmount('');
    setNote('');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-xl shadow-lg flex items-center gap-2 z-[100]">
          <CheckCircle size={20} /> {toast}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-[var(--color-secondary)] font-bold">&larr; العودة</button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">ملف العميل: {client.name}</h2>
            <p className="text-gray-500 mt-2">{client.phone}</p>
        </div>
        <div className="text-left">
            <p className="text-sm text-gray-500 mb-1">الدين المتبقي</p>
            <p className="text-4xl font-bold text-[var(--color-danger)] flex items-center justify-end gap-2">
                <DollarSign size={32} /> {(client.totalDebt || 0).toFixed(2)}
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Section */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold mb-4 text-[var(--color-primary)] text-[15px]">تسجيل دفعة سداد</h3>
            <div className="space-y-4">
              <input type="number" placeholder="المبلغ المسدد" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] text-[14px]" />
              <input type="text" placeholder="ملاحظة (اختياري)" value={note} onChange={(e) => setNote(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] text-[14px]" />
              <button 
                  onClick={submitPayment} 
                  className="w-full bg-[#2E6F40] text-white py-3 rounded-xl font-bold text-[14px] hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Plus size={18} /> حفظ الدفعة
              </button>
            </div>
          </div>

          {/* Payment History Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden max-h-[400px] overflow-y-auto">
            <h3 className="sticky top-0 bg-white p-6 font-bold border-b border-gray-100 text-[var(--color-primary)] text-lg">سجل السداد</h3>
            {client.paymentHistory && client.paymentHistory.length === 0 ? (
              <p className="p-6 text-gray-500 text-sm">لا توجد عمليات سداد مسجلة.</p>
            ) : (
              <table className="w-full text-right">
                <tbody className="text-[14px]">
                  {client.paymentHistory && [...client.paymentHistory].reverse().map(p => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 text-gray-600 text-xs">{p.date instanceof Date ? p.date.toLocaleDateString('ar-SA') : new Date(p.date).toLocaleDateString('ar-SA')}</td>
                      <td className="p-4 text-[var(--color-primary)] font-bold">{(p.amount || 0).toFixed(2)}</td>
                      <td className="p-4 text-gray-700">{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <FileText size={20} className="text-[var(--color-primary)]" />
            <h3 className="font-bold text-[var(--color-primary)] text-lg">سجل الفواتير الخاص بالعميل</h3>
        </div>
        {clientInvoices.length === 0 ? (
            <p className="p-6 text-gray-500">لا توجد فواتير مسجلة لهذا العميل.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-[13px] border-b">
                    <tr>
                    <th className="p-4 font-normal">التاريخ</th>
                    <th className="p-4 font-normal">المبلغ الإجمالي</th>
                    <th className="p-4 font-normal">المبلغ المدفوع</th>
                    <th className="p-4 font-normal">المتبقي (دين)</th>
                    <th className="p-4 font-normal">الحالة</th>
                    <th className="p-4 font-normal">إجراءات</th>
                    </tr>
                </thead>
                <tbody className="text-[14px]">
                    {clientInvoices.map((inv) => {
                        const total = calculateInvoiceTotal(inv);
                        const remaining = calculateInvoiceRemaining(inv);
                        return (
                            <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="p-4">{inv.date instanceof Date ? inv.date.toLocaleDateString('ar-SA') : new Date(inv.date).toLocaleDateString('ar-SA')}</td>
                                <td className="p-4 font-bold">{total.toFixed(2)} {inv.currency}</td>
                                <td className="p-4 text-green-600">{(inv.paidAmount || 0).toFixed(2)}</td>
                                <td className="p-4 text-[var(--color-danger)]">{remaining.toFixed(2)}</td>
                                <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs ${inv.status === PaymentStatus.PAID ? 'bg-green-100 text-green-800' : 'bg-[var(--color-accent)] text-white'}`}>
                                    {inv.status === PaymentStatus.PAID ? 'مدفوع' : inv.status === PaymentStatus.PARTIAL ? 'مدفوع جزئياً' : 'آجل'}
                                </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => printInvoice(inv, storeSettings)} className="text-[var(--color-primary)] hover:opacity-80 transition-opacity" title="طباعة الفاتورة">
                                        <Printer size={18} />
                                    </button>
                                    <button onClick={() => shareInvoiceToWhatsApp(inv, client)} className="text-green-600 hover:opacity-80 transition-opacity" title="مشاركة عبر واتساب">
                                        <MessageSquare size={18} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                </table>
            </div>
        )}
      </div>

    </div>
  );
}
