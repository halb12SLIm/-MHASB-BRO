import { Client } from '../types';
import { User, Phone, DollarSign } from 'lucide-react';

interface Props {
  clients: Client[];
}

export default function ClientsList({ clients }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">قائمة العملاء</h2>
        <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90">
          إضافة عميل
        </button>
      </div>

      {clients.length === 0 ? (
        <p className="text-center text-gray-500 py-10">لا يوجد عملاء بعد.</p>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <div key={client.id} className="bg-white p-4 rounded-lg shadow-sm border border-[var(--color-secondary)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[var(--color-primary)] bg-opacity-10 p-2 rounded-full text-[var(--color-primary)]">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone size={14} />
                    {client.phone}
                  </p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">الرصيد</p>
                <p className="font-bold text-lg flex items-center gap-1 text-[var(--color-danger)]">
                  <DollarSign size={16} />
                  {client.totalDebt.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
