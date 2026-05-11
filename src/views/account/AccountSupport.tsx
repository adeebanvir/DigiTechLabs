import React, { useState } from 'react';
import { 
  LifeBuoy, 
  MessageSquare, 
  Mail, 
  Search, 
  ChevronRight, 
  ExternalLink,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AccountSupport() {
  const faqs = [
    { q: 'How do I track my order?', a: 'You can track your order in the "Orders" section of your dashboard or through the tracking link sent to your email.' },
    { q: 'What is your refund policy?', a: 'We offer a 30-day money-back guarantee for all products in their original condition and packaging.' },
    { q: 'How can I change my email?', a: 'Email changes can be performed in the "Account Settings" section under personal information.' },
    { q: 'Do you offer international shipping?', a: 'Yes, we ship to over 150 countries worldwide with premium express options available.' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Help & Support</h1>
          <p className="text-gray-500 mt-1">Get instant answers and personalized assistance.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100">
              <Zap size={14} className="fill-green-700" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Average Response: 15m</span>
           </div>
        </div>
      </div>

      {/* Support Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all group">
            <div className="w-16 h-16 bg-[#00A650] text-white rounded-[24px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-[#00A650]/20">
               <MessageSquare size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Live Chat</h3>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">Speak with our expert support team in real-time for immediate help.</p>
            <button className="w-full mt-10 py-5 bg-[#111111] text-white font-bold rounded-2xl flex items-center justify-center gap-2 group-hover:bg-[#00A650] transition-all">
               Start Chat
               <ArrowRight size={18} />
            </button>
         </div>

         <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all group">
            <div className="w-16 h-16 bg-blue-500 text-white rounded-[24px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
               <Mail size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Email Case</h3>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">Create a support ticket for more complex technical inquiries.</p>
            <button className="w-full mt-10 py-5 bg-gray-50 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
               Open Ticket
               <ExternalLink size={18} />
            </button>
         </div>

         <div className="bg-white p-10 rounded-[44px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all group">
            <div className="w-16 h-16 bg-amber-500 text-white rounded-[24px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
               <LifeBuoy size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Help Center</h3>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">Browse our extensive library of guides, tutorials and FAQ.</p>
            <button className="w-full mt-10 py-5 bg-gray-50 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
               Explore Library
               <ArrowRight size={18} />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
         {/* FAQ Section */}
         <div className="lg:col-span-2 space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h3>
            <div className="space-y-4">
               {faqs.map((faq, i) => (
                 <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 hover:border-[#00A650]/20 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between">
                       <h4 className="font-bold text-gray-900 group-hover:text-[#00A650] transition-colors">{faq.q}</h4>
                       <ChevronRight size={20} className="text-gray-300 group-hover:text-[#00A650] transition-all group-hover:translate-x-1" />
                    </div>
                    <p className="text-sm text-gray-500 mt-4 leading-relaxed opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all">
                      {faq.a}
                    </p>
                 </div>
               ))}
            </div>
            
            <button className="flex items-center gap-2 text-[#00A650] font-bold text-sm hover:gap-3 transition-all">
               View all 150+ articles <ArrowRight size={16} />
            </button>
         </div>

         {/* Priority Support Card */}
         <div className="lg:col-span-1">
            <div className="bg-[#111111] p-10 rounded-[44px] text-white sticky top-28 overflow-hidden">
               <div className="absolute top-0 right-0 p-8 scale-150 opacity-10">
                  <ShieldCheck size={150} />
               </div>
               <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00A650] text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
                     <Zap size={12} className="fill-white" />
                     Priority Access
                  </div>
                  <h3 className="text-3xl font-bold leading-tight mb-6">Need instant answers?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-10">As a Gold Member, you have 24/7 access to our dedicated senior support engineers.</p>
                  
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                           <MessageCircle size={20} className="text-[#00A650]" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Priority Line</p>
                           <p className="font-bold text-sm">+1 (555) 900-8800</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                           <Mail size={20} className="text-blue-400" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Direct Email</p>
                           <p className="font-bold text-sm">vip@digitechlabs.com</p>
                        </div>
                     </div>
                  </div>
                  
                  <button className="w-full mt-12 py-5 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                     Request Callback
                  </button>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
