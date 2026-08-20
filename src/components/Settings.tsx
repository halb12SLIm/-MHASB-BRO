import React, { useRef } from 'react';
import { Upload, User, Store } from 'lucide-react';
import { StoreSettings } from '../types';
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface Props {
  settings: StoreSettings;
  onSave: (settings: StoreSettings) => void;
  user: any;
}

export default function Settings({ settings, onSave, user }: Props) {
  console.log('Settings component - current user:', user);
  const [formData, setFormData] = React.useState<StoreSettings>(settings);
  const [activeTab, setActiveTab] = React.useState<'account' | 'store'>('account');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLogin, setIsLogin] = React.useState(true);
  const [message, setMessage] = React.useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoBase64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('تم تسجيل الدخول بنجاح!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('تم إنشاء الحساب بنجاح!');
      }
    } catch (error: any) {
      setMessage('خطأ: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto p-4" dir="rtl">
      <h2 className="text-[20px] font-bold text-[var(--color-primary)]">الإعدادات</h2>
      
      <div className="flex gap-2 p-2 bg-gray-200 rounded-xl mb-6 border border-gray-300">
          <button onClick={() => setActiveTab('account')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'account' ? 'bg-white shadow-md text-[var(--color-primary)]' : 'text-gray-600'}`}>
              <User size={20} /> الحساب والأمان
          </button>
          <button onClick={() => setActiveTab('store')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'store' ? 'bg-white shadow-md text-[var(--color-primary)]' : 'text-gray-600'}`}>
              <Store size={20} /> إعدادات المتجر
          </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
        {activeTab === 'account' ? (
            !user ? (
                <form onSubmit={handleAuth} className="space-y-4">
                    <h3 className="font-bold text-[16px]">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</h3>
                    {message && <p className="text-sm p-2 bg-gray-100 rounded text-center">{message}</p>}
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="الإيميل" className="w-full p-3 border border-gray-200 rounded-xl" required />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" className="w-full p-3 border border-gray-200 rounded-xl" required />
                    <button type="submit" className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl">{isLogin ? 'دخول' : 'تسجيل'}</button>
                    <p className="text-center text-sm cursor-pointer text-blue-600" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'إنشاء حساب جديد' : 'لديك حساب؟ سجل دخول'}</p>
                </form>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm">أنت مسجل الدخول كـ: <span className="font-bold">{user.email}</span></p>
                    <button onClick={() => signOut(auth)} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white text-[14px] py-3 rounded-xl hover:opacity-90 transition-opacity">
                        تسجيل الخروج
                    </button>
                </div>
            )
        ) : (
            <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-[var(--color-secondary)] mb-2">شعار المتجر</label>
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-xl">
                    {formData.logoBase64 ? (
                      <img src={formData.logoBase64} alt="Logo" className="h-32 w-32 object-contain rounded-lg border" />
                    ) : (
                        <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">لا يوجد شعار</div>
                    )}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-6 py-2 bg-[var(--color-secondary)] text-white text-[13px] rounded-full hover:opacity-90 transition-opacity"
                    >
                        <Upload size={16} /> رفع شعار
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                </div>

                <div>
                    <label className="block text-[13px] font-bold text-[var(--color-secondary)] mb-1">اسم المتجر</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-xl border border-gray-200 p-2 text-[12px] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                </div>
                
                <div>
                    <label className="block text-[13px] font-bold text-[var(--color-secondary)] mb-1">رقم الهاتف</label>
                    <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full rounded-xl border border-gray-200 p-2 text-[12px] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                </div>

                <div>
                    <label className="block text-[13px] font-bold text-[var(--color-secondary)] mb-1">العنوان</label>
                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="mt-1 block w-full rounded-xl border border-gray-200 p-2 text-[12px] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                </div>

                <button onClick={() => onSave(formData)} className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white text-[14px] py-3 rounded-xl hover:opacity-90 transition-opacity mt-4">
                    حفظ الإعدادات
                </button>
            </div>
        )}
      </div>
    </div>
  );
}

