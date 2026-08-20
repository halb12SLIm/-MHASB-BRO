import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Client, InvoiceItem, PaymentStatus, Currency, Invoice, StoreSettings, calculateInvoiceTotal, calculateInvoiceRemaining } from '../types';

interface Props {
  clients: Client[];
  onSaveInvoice: (invoice: Invoice) => void;
  storeSettings: StoreSettings;
}

export default function CreateInvoice({ clients, onSaveInvoice, storeSettings }: Props) {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PAID);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [packaging, setPackaging] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [previousDebt, setPreviousDebt] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    const client = clients.find(c => c.id === selectedClientId);
    setPreviousDebt(client ? client.totalDebt : 0);
  }, [selectedClientId, clients]);

  const addItem = () => {
    setItems([...items, { itemName: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const tempInvoice: Invoice = {
    clientId: selectedClientId,
    clientName: clients.find(c => c.id === selectedClientId)?.name || '',
    date: new Date(),
    items,
    paidAmount,
    status: paymentStatus,
    currency,
    discountValue: 0,
    discountType: 'fixed',
    packagingFee: packaging,
    previousDebt,
    note
  };

  const finalTotal = calculateInvoiceTotal(tempInvoice);
  const totalDue = calculateInvoiceRemaining(tempInvoice);

  const handleSave = () => {
    if (!selectedClientId) return;
    onSaveInvoice({
      ...tempInvoice,
      id: Date.now().toString(),
    });
  };

  const inputClasses = "p-2 border border-[var(--color-secondary)] rounded-lg focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none";

  return (
    <div id="create-invoice-form" className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-[var(--color-secondary)]" dir="rtl">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] pb-4 border-b border-[var(--color-secondary)]">إنشاء فاتورة جديدة</h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)]">اختر العميل</label>
          <select 
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full mt-1 p-2 border border-[var(--color-secondary)] rounded-lg outline-none"
          >
            <option value="">-- اختر عميلاً --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)]">العملة</label>
          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="w-full mt-1 p-2 border border-[var(--color-secondary)] rounded-lg outline-none"
          >
            {Object.values(Currency).map(c => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)]">الحساب السابق للعميل</label>
          <div className="text-xl font-bold text-[var(--color-danger)] p-2 bg-red-50 rounded mt-1">
            {previousDebt.toFixed(2)} {currency.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <label className="block text-[13px] font-bold text-[var(--color-secondary)]">البنود</label>
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead className="bg-[var(--color-primary)] text-white text-[13px]">
              <tr>
                <th className="p-3">اسم المنتج</th>
                <th className="p-3">الكمية</th>
                <th className="p-3">السعر</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-b-0">
                  <td className="p-2"><input type="text" value={item.itemName} onChange={(e) => updateItem(index, 'itemName', e.target.value)} className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)]" /></td>
                  <td className="p-2"><input type="number" onFocus={(e) => e.target.value = ''} value={item.quantity === 0 ? '' : item.quantity} onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)]" /></td>
                  <td className="p-2"><input type="number" onFocus={(e) => e.target.value = ''} value={item.unitPrice === 0 ? '' : item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)]" /></td>
                  <td className="p-2 text-center"><button onClick={() => setItems(items.filter((_, i) => i !== index))} className="text-[var(--color-danger)]"><Trash2 size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addItem} className="flex items-center gap-1 text-[var(--color-primary)] font-bold text-[13px] bg-white border border-[var(--color-primary)] px-4 py-2 rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-all"><Plus size={18} /> إضافة بند</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" onFocus={(e) => e.target.value = ''} placeholder="تكاليف التغليف" value={packaging === 0 ? '' : packaging} onChange={(e) => setPackaging(parseFloat(e.target.value) || 0)} className="p-4 border border-[var(--color-secondary)] rounded-xl outline-none text-[12px] bg-[#FDFBF7]" />
        <input type="number" onFocus={(e) => e.target.value = ''} placeholder="المبلغ المدفوع" value={paidAmount === 0 ? '' : paidAmount} onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)} className="p-4 border border-[var(--color-secondary)] rounded-xl outline-none text-[12px] bg-[#FDFBF7]" />
        <textarea 
          placeholder="رسالة للعميل..." 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
          className="w-full p-4 border border-[var(--color-secondary)] rounded-xl outline-none text-[12px] bg-[#FDFBF7]"
        />
      </div>

      <div className="border border-[var(--color-secondary)] rounded-2xl p-4 bg-[#FDFBF7]">
        <label className="block text-[13px] font-bold text-[var(--color-secondary)] mb-3">نوع الفاتورة</label>
        <div className="flex gap-4 text-[13px]">
            {Object.values(PaymentStatus).map(status => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" checked={paymentStatus === status} onChange={() => setPaymentStatus(status)} className="accent-[var(--color-primary)]" />
                {status === 'paid' ? 'نقدي' : status === 'debt' ? 'مؤجل' : 'دفع جزئي'}
            </label>
            ))}
        </div>
      </div>

      <div className="text-[20px] font-bold text-[var(--color-secondary)] bg-[var(--color-accent)] p-5 rounded-2xl text-center shadow-inner">
        الإجمالي الكلي المستحق: {totalDue.toFixed(2)} {currency.toUpperCase()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={handleSave} className="flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white p-3 rounded-xl hover:opacity-90 font-bold text-[14px]">
            <Save size={18} /> حفظ الفاتورة
        </button>
        <button className="flex items-center justify-center gap-2 bg-[var(--color-secondary)] text-white p-3 rounded-xl hover:opacity-90 font-bold text-[14px]">
            طباعة الفاتورة
        </button>
        <button className="flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-xl hover:opacity-90 font-bold text-[14px]">
            إرسال عبر الواتساب
        </button>
      </div>
    </div>
  );
}
