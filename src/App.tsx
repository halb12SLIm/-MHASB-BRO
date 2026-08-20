/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Auth } from './components/Auth';
import { Users, FileText, ListOrdered, DollarSign, Plus, Menu, X, Settings, Printer, Wallet, Gift, Trash2, Euro, Coins } from 'lucide-react';
import ClientsList from './components/ClientsList';
import CreateInvoice from './components/CreateInvoice';
import InvoiceLog from './components/InvoiceLog';
import SettingsComponent from './components/Settings';
import DebtManagement from './components/DebtManagement';
import ClientProfile from './components/ClientProfile';
import Raffle from './components/Raffle';
import { AddClient } from './components/AddClient';
import { Client, Invoice, PaymentStatus, calculateInvoiceRemaining, calculateInvoiceTotal, StoreSettings, Currency } from './types';
import { AppHealthMonitor } from './components/AppHealthMonitor';

type Section = 'clients' | 'invoices' | 'invoice-log' | 'debts' | 'add-client' | 'settings' | 'raffle' | 'client-profile';

const mockClients: Client[] = [
  { id: '1', name: 'محمد أحمد', phone: '0501234567', totalDebt: 1500.0, paymentHistory: [] },
  { id: '2', name: 'سارة خالد', phone: '0559876543', totalDebt: 0.0, paymentHistory: [] },
];

const mockInvoices: Invoice[] = [
  { id: 'inv1', clientId: '1', clientName: 'محمد أحمد', date: new Date(), items: [{ itemName: 'خدمة برمجية', quantity: 1, unitPrice: 1500 }], paidAmount: 0, status: PaymentStatus.DEBT, currency: Currency.USD, discountValue: 0, discountType: 'fixed', packagingFee: 0, previousDebt: 0 },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user as any);
        setLoading(false);
    });
    return unsubscribe;
  }, []);

  const [activeSection, setActiveSection] = useState<Section>('clients');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
      const saved = localStorage.getItem('storeSettings');
      return saved ? JSON.parse(saved) : { 
        name: 'محاسب سليم برو', 
        phone: '', 
        address: '' 
      };
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] font-bold text-[var(--color-primary)]">جاري التحميل...</div>;
  if (!user) return <Auth />;

  // Update localStorage when storeSettings changes
  useEffect(() => {
      localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  const handleAddPayment = (clientId: string, amount: number, note: string) => {
    let remainingAmount = amount;
    
    // 1. Update Invoices
    setInvoices(prev => prev.map(inv => {
      if (inv.clientId === clientId && remainingAmount > 0) {
        const remainingInvoiceDebt = calculateInvoiceRemaining(inv);
        if (remainingInvoiceDebt > 0) {
          const paymentForInvoice = Math.min(remainingInvoiceDebt, remainingAmount);
          remainingAmount -= paymentForInvoice;
          return { ...inv, paidAmount: inv.paidAmount + paymentForInvoice };
        }
      }
      return inv;
    }));

    // 2. Update Client Total Debt
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

  const totalDebtByCurrency = useMemo(() => {
    const totals: Record<Currency, number> = {
      [Currency.USD]: 0,
      [Currency.EUR]: 0,
      [Currency.TRY]: 0,
    };
    invoices.forEach(invoice => {
      const remaining = calculateInvoiceRemaining(invoice);
      if (invoice.currency in totals) {
        totals[invoice.currency as Currency] += Math.max(0, remaining);
      }
    });
    return totals;
  }, [invoices]);

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
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

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
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
                        opacity: 0.15
                    }}
                />
            </div>
        )}

        <div className="relative z-10">
          <header className="bg-[var(--color-primary)] shadow-lg text-white">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className='flex items-center gap-4'>
                <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className='p-2 hover:bg-black/10 rounded-xl z-[1000] cursor-pointer transition-colors'>
                    <Menu size={24} />
                </button>
                <div className='flex items-center gap-4'>
                  {storeSettings.logoBase64 && (
                      <img src={storeSettings.logoBase64} alt="Logo" className="w-[50px] h-[50px] object-contain bg-white rounded-full p-1" />
                  )}
                  <div className='flex flex-col'>
                      <h1 className="text-2xl font-bold cursor-pointer text-white" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>محاسب سليم برو</h1>
                      <div className="bg-white rounded-full px-3 py-0.5 mt-1 shadow-sm">
                        <span className="text-[11px] text-[var(--color-secondary)] font-bold leading-none">تم تصميم هذا التطبيق من قبل المهندس خالد سليم أبو محمد</span>
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
                <div className="flex-1 overflow-y-auto py-4 px-3">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { 
                        setActiveSection(item.id as Section); 
                        setSelectedClientId(null); 
                        setIsDrawerOpen(false); 
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 my-1.5 rounded-2xl transition-all duration-300 font-medium ${
                        activeSection === item.id
                          ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30'
                          : 'text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 hover:text-[var(--color-primary)]'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className='text-[15px]'>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <main className="max-w-7xl mx-auto p-4">
            {activeSection === 'clients' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[ { currency: Currency.USD, label: 'ديون دولار', icon: DollarSign }, { currency: Currency.EUR, label: 'ديون يورو', icon: Euro }, { currency: Currency.TRY, label: 'ديون تركي', icon: Coins } ].map(({ currency, label, icon: Icon }) => (
                  <div key={currency} className="p-6 bg-white rounded-3xl shadow-sm border border-red-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{label}</p>
                      <p className="text-2xl font-bold text-[var(--color-danger)] mt-1">{totalDebtByCurrency[currency].toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-[var(--color-danger)]/10 rounded-2xl text-[var(--color-danger)]">
                      <Icon size={20} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeSection === 'clients' && <ClientsList clients={clients} onDeleteClient={handleDeleteClient} onClientClick={(id) => { setSelectedClientId(id); setActiveSection('client-profile'); }} />}
            {activeSection === 'add-client' && <AddClient onClientAdded={handleAddClient} onClose={() => setActiveSection('clients')} />}
            {activeSection === 'invoices' && <CreateInvoice clients={clients} onSaveInvoice={handleSaveInvoice} storeSettings={storeSettings} />}
            {activeSection === 'invoice-log' && <InvoiceLog invoices={invoices} clients={clients} storeSettings={storeSettings} onDeleteInvoice={handleDeleteInvoice} onClientClick={(id) => { setSelectedClientId(id); setActiveSection('client-profile'); }} />}
            {activeSection === 'raffle' && <Raffle clients={clients} />}
            {activeSection === 'client-profile' && selectedClientId && (
              <ClientProfile 
                client={clients.find(c => c.id === selectedClientId) || { id: '', name: 'غير معروف', phone: '', totalDebt: 0, paymentHistory: [] }}
                invoices={invoices}
                storeSettings={storeSettings}
                onAddPayment={handleAddPayment}
                onBack={() => {
                  setSelectedClientId(null);
                  setActiveSection('clients'); // or fallback to a previous section if needed, but 'clients' is safe
                }}
              />
            )}
            {activeSection === 'debts' && (
              <DebtManagement clients={clients} onSelectClient={(id) => {
                setSelectedClientId(id);
                setActiveSection('client-profile');
              }} />
            )}
            {activeSection === 'settings' && <SettingsComponent settings={storeSettings} onSave={setStoreSettings} user={user} />}
          </main>
        </div>
      </div>
    </AppHealthMonitor>
  );
}
