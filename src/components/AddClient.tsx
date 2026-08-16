import React, { useState } from 'react';
import { Client } from '../types';

interface Props {
  onClientAdded: (client: Client) => void;
  onClose: () => void;
}

export const AddClient: React.FC<Props> = ({ onClientAdded, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [debt, setDebt] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    onClientAdded({
      id: Date.now().toString(),
      name,
      phone,
      totalDebt: debt,
      paymentHistory: [],
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-sm border border-[var(--color-secondary)]">
      <h2 className="text-xl font-bold text-[var(--color-primary)]">إضافة عميل جديد</h2>
      <input type="text" placeholder="اسم العميل" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-[var(--color-secondary)] rounded-lg" required />
      <input type="tel" placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border border-[var(--color-secondary)] rounded-lg" />
      <input type="number" onFocus={(e) => e.target.value === '0' && e.target.setSelectionRange(0, 10)} placeholder="الرصيد الافتتاحي" value={debt} onChange={(e) => setDebt(parseFloat(e.target.value) || 0)} className="w-full p-2 border border-[var(--color-secondary)] rounded-lg" />
      <button type="submit" className="w-full bg-[var(--color-primary)] text-white p-2 rounded-lg">حفظ العميل</button>
    </form>
  );
};
