import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-sm border border-gray-100 rounded-3xl w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[var(--color-primary)] bg-opacity-10 rounded-full flex items-center justify-center text-[var(--color-primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-9 7.96V15h-2v6.96A8 8 0 0 1 3 14V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2h-2z"></path></svg>
          </div>
        </div>
        <h2 className="text-2xl mb-2 font-bold text-center text-[var(--color-primary)]">محاسب سليم برو</h2>
        <h3 className="text-sm mb-6 font-medium text-center text-gray-500">{isLogin ? 'سجل دخولك للمتابعة' : 'أنشئ حساباً جديداً للبدء'}</h3>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="البريد الإلكتروني" 
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)]"
          required
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="كلمة المرور" 
          className="w-full p-3 mb-6 border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)]"
          required
        />
        <button type="submit" className="w-full p-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
        </button>
        <p 
          className="mt-6 text-center text-sm cursor-pointer text-[var(--color-secondary)] hover:underline font-bold" 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ سجل دخول'}
        </p>
      </form>
    </div>
  );
};
