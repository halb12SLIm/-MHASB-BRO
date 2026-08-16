import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { StoreSettings } from '../types';

interface Props {
  settings: StoreSettings;
  onSave: (settings: StoreSettings) => void;
}

export default function Settings({ settings, onSave }: Props) {
  const [formData, setFormData] = React.useState<StoreSettings>(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-6 max-w-lg mx-auto p-4" dir="rtl">
      <h2 className="text-[20px] font-bold text-[var(--color-primary)]">إعدادات المتجر والشعار</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
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
    </div>
  );
}
