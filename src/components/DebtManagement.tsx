import { Client } from '../types';
import { DollarSign } from 'lucide-react';

interface Props {
  clients: Client[];
  onSelectClient: (id: string) => void;
}

export default function DebtManagement({ clients, onSelectClient }: Props) {
  const indebtedClients = clients.filter(c => c.totalDebt > 0);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">الديون والذمم</h2>
      {indebtedClients.length === 0 ? (
        <p className="text-gray-500">لا توجد ديون مستحقة.</p>
      ) : (
        <div className="grid gap-4">
          {indebtedClients.map(client => (
            <div key={client.id} className="bg-white p-4 rounded-lg shadow-sm border border-[var(--color-secondary)] flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{client.name}</h3>
                <p className="text-[var(--color-danger)] font-bold flex items-center gap-1">
                  <DollarSign size={16} />
                  {client.totalDebt.toFixed(2)}
                </p>
              </div>
              <button 
                onClick={() => onSelectClient(client.id!)}
                className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                عرض التفاصيل
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
