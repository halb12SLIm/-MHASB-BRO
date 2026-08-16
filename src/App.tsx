/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { Users, FileText, ListOrdered, DollarSign, Plus, Menu, X, Settings, Printer, Wallet, Gift } from 'lucide-react';
import ClientsList from './components/ClientsList';
import CreateInvoice from './components/CreateInvoice';
import InvoiceLog from './components/InvoiceLog';
import SettingsComponent from './components/Settings';
import DebtManagement from './components/DebtManagement';
import ClientDebtDetail from './components/ClientDebtDetail';
import Raffle from './components/Raffle';
import { AddClient } from './components/AddClient';
import { Client, Invoice, PaymentStatus, calculateInvoiceRemaining, StoreSettings, Currency } from './types';
import { AppHealthMonitor } from './components/AppHealthMonitor';

type Section = 'clients' | 'invoices' | 'invoice-log' | 'debts' | 'add-client' | 'settings' | 'raffle';

const mockClients: Client[] = [
  { id: '1', name: 'محمد أحمد', phone: '0501234567', totalDebt: 1500.0, paymentHistory: [] },
  { id: '2', name: 'سارة خالد', phone: '0559876543', totalDebt: 0.0, paymentHistory: [] },
];

const mockInvoices: Invoice[] = [
  { id: 'inv1', clientId: '1', clientName: 'محمد أحمد', date: new Date(), items: [{ itemName: 'خدمة برمجية', quantity: 1, unitPrice: 1500 }], paidAmount: 0, status: PaymentStatus.DEBT, currency: Currency.USD, discountValue: 0, discountType: 'fixed', packagingFee: 0, previousDebt: 0 },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('clients');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({ 
    name: 'محاسب سليم برو', 
    phone: '', 
    address: '' 
  });

  const handleAddPayment = (clientId: string, amount: number, note: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          totalDebt: Math.max(0, c.totalDebt - amount),
          paymentHistory: [...c.paymentHistory, { id: Date.now().toString(), clientId, amount, date: new Date(), note }]
        };
      }
      return c;
    }));
  };

  const handleAddClient = (client: Client) => {
    setClients(prev => [...prev, client]);
    setActiveSection('clients');
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    setInvoices(prev => [...prev, invoice]);
    if (invoice.status !== PaymentStatus.PAID) {
      const remainingAmount = calculateInvoiceRemaining(invoice);
      setClients(prev => prev.map(c => {
        if (c.id === invoice.clientId) {
          return { ...c, totalDebt: c.totalDebt + remainingAmount };
        }
        return c;
      }));
    }
    setActiveSection('invoice-log');
  };

  const navItems = [
    { id: 'invoices', label: 'إنشاء فاتورة', icon: FileText },
    { id: 'invoice-log', label: 'سجل الفواتير', icon: ListOrdered },
    { id: 'add-client', label: 'إضافة عميل', icon: Plus },
    { id: 'clients', label: 'قائمة العملاء', icon: Users },
    { id: 'debts', label: 'إدارة الديون والذمم', icon: DollarSign },
    { id: 'raffle', label: 'عجلة السحب', icon: Gift },
    { id: 'settings', label: 'إعدادات التطبيق', icon: Settings },
  ] as const;

  return (
    <AppHealthMonitor>
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] relative" dir="rtl">
        {storeSettings.logoBase64 && (
            <div 
                className="fixed inset-0 pointer-events-none flex items-center justify-center"
                style={{
                    zIndex: 0
                }}
            >
                <img 
                    src={storeSettings.logoBase64} 
                    alt="Watermark" 
                    className="w-[400px] h-[400px] object-contain"
                    style={{
                        opacity: 1
                    }}
                />
            </div>
        )}

        <div className="relative z-10">
          <header className="bg-[var(--color-primary)] shadow-md text-white">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className='flex items-center gap-2'>
                <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className='p-2 hover:bg-[var(--color-secondary)] rounded-lg z-[1000] cursor-pointer'>
                    <Menu />
                </button>
                <div className='flex items-center gap-3'>
                  {storeSettings.logoBase64 && (
                      <img src={storeSettings.logoBase64} alt="Logo" className="w-[45px] h-[45px] object-contain" />
                  )}
                  <div className='flex flex-col'>
                      <h1 className="text-xl font-bold cursor-pointer text-white" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>محاسب سليم برو</h1>
                      <div className="bg-white rounded-[6px] px-2 py-0.5 mt-0.5">
                        <span className="text-[10px] text-black font-medium leading-none">تم تصميم هذا التطبيق من قبل المهندس خالد سليم أبو محمد</span>
                      </div>
                  </div>
                </div>
              </div>
            </nav>
          </header>

          {/* Drawer Overlay */}
          {isDrawerOpen && (
            <div className="fixed inset-0 z-[100] flex">
              {/* Backdrop with lighter opacity to fix "black screen" issue */}
              <div className="fixed inset-0 bg-black bg-opacity-20" onClick={() => setIsDrawerOpen(false)}></div>
              
              {/* Sidebar */}
              <div className="relative w-72 bg-[var(--color-bg)] shadow-xl flex flex-col h-full z-[101] border-l border-gray-200">
                {/* Drawer Header */}
                <div className="bg-[var(--color-primary)] p-4 flex items-center justify-between text-white">
                  <div className='flex items-center gap-2'>
                    <Wallet className="text-[var(--color-accent)]" size={20} />
                    <span className='font-bold text-[15px]'>محاسب سليم برو</span>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="hover:bg-white/20 p-1 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                {/* Drawer Menu Items */}
                <div className="flex-1 overflow-y-auto py-2 px-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { 
                        setActiveSection(item.id as Section); 
                        setSelectedClientId(null); 
                        setIsDrawerOpen(false); 
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 my-1 rounded-xl transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-[var(--color-accent)] text-[var(--color-secondary)] font-bold'
                          : 'text-[var(--color-secondary)] hover:bg-black/5'
                      }`}
                    >
                      <item.icon size={18} />
                      <span className='text-[14px]'>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <main className="max-w-7xl mx-auto p-4">
            {activeSection === 'clients' && <ClientsList clients={clients} />}
            {activeSection === 'add-client' && <AddClient onClientAdded={handleAddClient} onClose={() => setActiveSection('clients')} />}
            {activeSection === 'invoices' && <CreateInvoice clients={clients} onSaveInvoice={handleSaveInvoice} storeSettings={storeSettings} />}
            {activeSection === 'invoice-log' && <InvoiceLog invoices={invoices} clients={clients} storeSettings={storeSettings} />}
            {activeSection === 'raffle' && <Raffle clients={clients} />}
            {activeSection === 'debts' && (
              selectedClientId ? (
                <ClientDebtDetail 
                  client={clients.find(c => c.id === selectedClientId) || { id: '', name: 'غير معروف', phone: '', totalDebt: 0, paymentHistory: [] }}
                  onAddPayment={handleAddPayment}
                  onBack={() => setSelectedClientId(null)}
                />
              ) : (
                <DebtManagement clients={clients} onSelectClient={setSelectedClientId} />
              )
            )}
            {activeSection === 'settings' && <SettingsComponent settings={storeSettings} onSave={setStoreSettings} />}
          </main>
        </div>
      </div>
    </AppHealthMonitor>
  );
}
