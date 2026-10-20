'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { SupportedLanguage, translations } from '@/lib/translations';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const t = translations[currentLang];
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Suggest APK Repository / Report Link',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 rounded-2xl border-2 border-cyan-400/80 bg-[#071126] shadow-[0_0_40px_rgba(6,182,212,0.35)] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/25 flex items-center justify-between bg-[#081530]">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span>{t.contactTitle}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-cyan-950/50 border border-cyan-500/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-5 sm:p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-white">{t.contactSuccess}</h3>
              <p className="text-xs text-slate-400">سيتم مراجعة طلبك وإضافته في التحديث القادم.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                {t.contactDesc}
              </p>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.contactName}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#091733] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  placeholder="اسمك أو اسم الفريق"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.contactEmail}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#091733] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.contactSubject}</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#091733] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">{t.contactMessage}</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#091733] border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  placeholder="اكتب رابط المستودع أو ملاحظاتك حول أي ملف..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
                <span>{t.contactSend}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
