import { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, RotateCw, Plus, X, Users } from 'lucide-react';
import { Client } from '../types';

interface RaffleProps {
  clients: Client[];
}

const prizes = [
  "عبوة عسل طبيعي فاخر",
  "خصم خاص 50%",
  "هدية عسل مجانية"
];

export default function Raffle({ clients }: RaffleProps) {
  const [participants, setParticipants] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [winner, setWinner] = useState<{ name: string; prize: string } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);

  const startRaffle = () => {
    if (participants.length === 0) return;
    setIsSpinning(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * participants.length);
      const selectedWinner = participants[randomIndex];
      
      setWinner({ name: selectedWinner, prize: prizes[prizeIndex] });
      setIsSpinning(false);
      setPrizeIndex((prizeIndex + 1) % prizes.length);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#2E6F40']
      });
    }, 3000);
  };

  const shareToWhatsApp = () => {
    if (!winner) return;
    const text = `🎉 ألف مبروك للفائز ${winner.name} بالجائزة ${winner.prize}! مقدمة من عسل سليم - عسل طبيعي 100%`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100" dir="rtl">
      <h2 className="text-2xl font-bold text-[var(--color-primary)]">عجلة السحب</h2>

      <div className="flex flex-col items-center gap-6">
        <motion.div 
          className="w-64 h-64 rounded-full border-8 border-[var(--color-primary)] flex items-center justify-center bg-gradient-to-tr from-[#D4AF37] to-[#2E6F40]"
          animate={{ rotate: isSpinning ? 3600 : 0 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        >
          <Gift size={64} className="text-white" />
        </motion.div>

        <button 
          onClick={startRaffle}
          disabled={isSpinning || participants.length === 0}
          className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
        >
          <RotateCw size={20} />
          {isSpinning ? 'جاري السحب...' : 'تدوير العجلة / ابدأ السحب'}
        </button>
      </div>

      <div className="space-y-4 pt-6 border-t border-gray-100">
        <h3 className="font-bold text-lg">إدارة المشاركين</h3>
        <div className="flex gap-2">
            <button onClick={() => setParticipants(clients.map(c => c.name))} className="flex items-center gap-2 bg-gray-100 p-3 rounded-xl text-[13px] font-bold"><Users size={16}/> جلب جميع العملاء</button>
        </div>
        <div className="flex gap-2">
            <input type="text" value={manualInput} onChange={(e) => setManualInput(e.target.value)} placeholder="أضف اسم مشارك" className="flex-grow p-3 border border-gray-200 rounded-xl outline-none" />
            <button onClick={() => { if(manualInput) { setParticipants([...participants, manualInput]); setManualInput(''); } }} className="bg-[var(--color-primary)] text-white px-4 py-3 rounded-xl font-bold"><Plus size={20}/></button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
            {participants.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-[13px]">
                    {p}
                    <button onClick={() => setParticipants(participants.filter((_, idx) => idx !== i))} className="text-red-500"><X size={16}/></button>
                </div>
            ))}
        </div>
      </div>

      {winner && (
        <div className="bg-green-50 p-6 rounded-2xl border border-green-200 text-center space-y-4">
          <h3 className="text-xl font-bold text-[var(--color-primary)]">🎉 ألف مبروك!</h3>
          <p className="text-lg">الفائز: <strong>{winner.name}</strong></p>
          <p className="text-lg">الجائزة: <strong>{winner.prize}</strong></p>
          <button 
            onClick={shareToWhatsApp}
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700"
          >
            إرسال التهنئة عبر الواتساب
          </button>
        </div>
      )}
    </div>
  );
}
