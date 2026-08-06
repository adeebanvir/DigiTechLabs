import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight, Plus, Loader2 } from 'lucide-react';
import { settingsService } from '../services/dataService';
import { AppSetting } from '../types';

export default function Contact() {
  const [settings, setSettings] = useState<AppSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Tech Inquiry',
    message: ''
  });

  useEffect(() => {
    setLoading(true);
    settingsService.getSettings('home')
      .then(data => {
        if (data) {
          setSettings(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load contact settings", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    // Mock submission with visual timing feedback
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setShowToast(true);
      setFormData({
        name: '',
        email: '',
        subject: 'General Tech Inquiry',
        message: ''
      });

      // Clear the Toast notification after 5 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }, 1000);
  };

  const contactItems = [
    { 
      icon: <Mail className="w-6 h-6" />, 
      title: 'Support', 
      value: settings?.supportEmail || 'assist@digitechlabs.com' 
    },
    { 
      icon: <MessageCircle className="w-6 h-6" />, 
      title: 'Partnerships', 
      value: settings?.partnershipsEmail || 'growth@digitechlabs.com' 
    },
    { 
      icon: <Phone className="w-6 h-6" />, 
      title: 'Call Us', 
      value: settings?.phone || '+1 (888) DIGI-LAB' 
    },
    { 
      icon: <MapPin className="w-6 h-6" />, 
      title: 'Headquarters', 
      value: settings?.address || 'One Infinite Loop, Tech City' 
    },
  ];

  if (loading) {
    return (
      <div className="pt-32 pb-24 bg-gray-50 min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#00A650]" size={40} />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Contact Hub...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-20 text-center mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-[#141414] mb-8 leading-tight">
            {settings?.contactTitle || "Let's Start a"} <span className="text-[#00A650]">Dialogue.</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            {settings?.contactSubtitle || "Technical issues, partnership inquiries, or just sharing your tech vision—our experts are ready to listen."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {contactItems.map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-center space-x-6 hover:shadow-xl hover:shadow-black/5 transition-all"
                >
                  <div className="p-4 bg-[#F5F5F0] rounded-2xl text-[#00A650]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{item.title}</p>
                    <p className="text-lg font-bold text-[#141414] break-all">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-10 bg-[#141414] rounded-[2.5rem] text-white">
              <h4 className="text-xl font-bold mb-6">Response Time</h4>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-[#00A650] rounded-full animate-pulse" />
                <p className="text-gray-400 font-medium">{settings?.responseTime || "Currently active: 12-24 hour response window."}</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-black/[0.02]">
              <form onSubmit={handleSubmit} className="space-y-8">
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-emerald-50 border border-emerald-100 text-[#00A650] rounded-3xl flex items-start space-x-4 shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full -mr-16 -mt-16 pointer-events-none" />
                    <div className="w-10 h-10 bg-[#00A650] rounded-full flex items-center justify-center text-white shrink-0 shadow-md shadow-[#00A650]/20">
                      <span className="text-lg">🎉</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-[#141414] text-lg mb-1">Message Sent Successfully! 🎉</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        We've received your query. Our engineers have registered the ticket and will reach out to you shortly.
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-emerald-800 hover:text-emerald-950 font-bold text-sm bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm"
                      aria-label="Dismiss banner"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#00A650] text-[#141414] font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#00A650] text-[#141414] font-medium transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Subject</label>
                    <select 
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#00A650] text-[#141414] font-medium cursor-pointer"
                    >
                      <option value="General Tech Inquiry">General Tech Inquiry</option>
                      <option value="Order Support">Order Support</option>
                      <option value="Partnership Proposal">Partnership Proposal</option>
                      <option value="Press & Media">Press & Media</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Brief Message</label>
                    <textarea 
                      required
                      placeholder="How can we help your tech ecosystem today?"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#00A650] text-[#141414] font-medium resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={sending}
                    className="w-full h-16 bg-[#141414] text-white rounded-2xl font-bold hover:bg-[#00A650] transition-all duration-300 transform active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="animate-spin mr-2 w-5 h-5" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight mb-12 text-center text-[#141414]">Frequently asked.</h2>
          <div className="space-y-4">
            {[
              { q: 'How fast is your global shipping?', a: 'We offer same-day processing for all orders. Domestic delivery typically takes 24-48 hours, while international logistics range from 3-5 business days.' },
              { q: 'What is the DigiTechLabs warranty?', a: 'Every device in our ecosystem comes with a 2-year premium warranty covering all manufacturing defects and performance inconsistencies.' },
              { q: 'Do you offer bulk enterprise pricing?', a: 'Yes. For orders exceeding 20 units, please reach out via our Partnerships subject line for tailored ecosystem solutions.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <summary className="p-8 font-bold text-lg text-[#141414] cursor-pointer flex justify-between items-center list-none select-none">
                  {faq.q}
                  <Plus className="w-5 h-5 text-[#00A650] group-open:rotate-45 transition-transform duration-200" />
                </summary>
                <div className="px-8 pb-8 text-gray-500 leading-relaxed animate-in fade-in duration-200">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -20, scale: 0.9, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-24 left-1/2 z-50 bg-white border border-emerald-100 rounded-3xl py-4 px-8 shadow-2xl shadow-emerald-950/10 flex items-center space-x-4 max-w-md w-[90vw] md:w-auto"
          >
            <div className="w-10 h-10 bg-[#00A650] rounded-full flex items-center justify-center text-white shrink-0 shadow-md shadow-[#00A650]/20 animate-bounce">
              <span className="text-lg">🎉</span>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-[#141414] text-base">Message Sent Successfully! 🎉</h4>
              <p className="text-xs text-gray-500">The form has been cleared and your inquiry logged.</p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 font-bold text-lg pl-2 transition-colors self-start"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
