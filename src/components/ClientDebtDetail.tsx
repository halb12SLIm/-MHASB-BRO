import { useState } from 'react';
import { Client, PaymentRecord } from '../types';
import { DollarSign, Plus, FileText, CheckCircle, X } from 'lucide-react';

interface Props {
  client: Client;
  onAddPayment: (clientId: string, amount: number, note: string) => void;
  onBack: () => void;
}

export default function ClientDebtDetail({ client, onAddPayment, onBack }: Props) {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [note, setNote] = useState('');
  const [toast, setToast] = useState<string | null>(null);

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
        <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-3 rounded-2xl font-bold hover:opacity-90">
            <FileText size={18} /> كشف الحساب الشامل
        </button>
      </div>

      <h2 className="text-2xl font-bold text-[var(--color-primary)]">تفاصيل ديون {client.name}</h2>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">إجمالي الدين المتبقي</p>
        <p className="text-5xl font-bold text-[var(--color-danger)] flex items-center gap-2">
          <DollarSign size={40} /> {(client.totalDebt || 0).toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="font-bold mb-4 text-[var(--color-primary)] text-[15px]">تسجيل دفعة سداد</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" placeholder="المبلغ المسدد" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="p-3 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] text-[14px]" />
          <input type="text" placeholder="ملاحظة (اختياري)" value={note} onChange={(e) => setNote(e.target.value)} className="p-3 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] text-[14px]" />
        </div>
        <button 
            onClick={submitPayment} 
            className="w-full mt-4 bg-[#2E6F40] text-white py-3 rounded-xl font-bold text-[14px] hover:opacity-90 flex items-center justify-center gap-2"
        >
          <Plus size={18} /> حفظ الدفعة
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="p-6 font-bold border-b border-gray-100 text-[var(--color-primary)] text-lg">سجل السداد</h3>
        {client.paymentHistory && client.paymentHistory.length === 0 ? (
          <p className="p-6 text-gray-500">لا توجد عمليات سداد مسجلة.</p>
        ) : (
          <table className="w-full text-right">
            <tbody className="text-[14px]">
              {client.paymentHistory && [...client.paymentHistory].reverse().map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-5 text-gray-600">{p.date instanceof Date ? p.date.toLocaleDateString('ar-SA') : new Date(p.date).toLocaleDateString('ar-SA')}</td>
                  <td className="p-5 text-[var(--color-primary)] font-bold text-lg">{(p.amount || 0).toFixed(2)}</td>
                  <td className="p-5 text-gray-700">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
