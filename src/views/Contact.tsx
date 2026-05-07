import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-20 text-center mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-[#141414] mb-8 leading-tight">
            Let's Start a <span className="text-[#00A650]">Dialogue.</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Technical issues, partnership inquiries, or just sharing your tech vision—our experts are ready to listen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: <Mail className="w-6 h-6" />, title: 'Technical Support', value: 'assist@digitechlabs.com' },
                { icon: <MessageCircle className="w-6 h-6" />, title: 'Partnerships', value: 'growth@digitechlabs.com' },
                { icon: <Phone className="w-6 h-6" />, title: 'Call Us', value: '+1 (888) DIGI-LAB' },
                { icon: <MapPin className="w-6 h-6" />, title: 'Headquarters', value: 'One Infinite Loop, Tech City' },
              ].map((item, i) => (
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
                    <p className="text-lg font-bold text-[#141414]">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-10 bg-[#141414] rounded-[2.5rem] text-white">
              <h4 className="text-xl font-bold mb-6">Response Time</h4>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-[#00A650] rounded-full animate-pulse" />
                <p className="text-gray-400 font-medium">Currently active: 12-24 hour response window.</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-2xl shadow-black/[0.02]">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-16 h-16 bg-[#00A650] rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#141414] mb-4">Message Transmitted.</h3>
                  <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                    We've received your query. An engineer from our support ecosystem will reach out to you shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-[#00A650] font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#00A650] text-[#141414] font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#00A650] text-[#141414] font-medium transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Subject</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#00A650] text-[#141414] font-medium cursor-pointer">
                      <option>General Tech Inquiry</option>
                      <option>Order Support</option>
                      <option>Partnership Proposal</option>
                      <option>Press & Media</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Brief Message</label>
                    <textarea 
                      required
                      placeholder="How can we help your tech ecosystem today?"
                      rows={6}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#00A650] text-[#141414] font-medium resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full h-16 bg-[#141414] text-white rounded-2xl font-bold hover:bg-[#00A650] transition-all duration-300 transform active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center group"
                  >
                    Send Message
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight mb-12 text-center">Frequently asked.</h2>
          <div className="space-y-4">
            {[
              { q: 'How fast is your global shipping?', a: 'We offer same-day processing for all orders. Domestic delivery typically takes 24-48 hours, while international logistics range from 3-5 business days.' },
              { q: 'What is the DigiTechLabs warranty?', a: 'Every device in our ecosystem comes with a 2-year premium warranty covering all manufacturing defects and performance inconsistencies.' },
              { q: 'Do you offer bulk enterprise pricing?', a: 'Yes. For orders exceeding 20 units, please reach out via our Partnerships subject line for tailored ecosystem solutions.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <summary className="p-8 font-bold text-lg text-[#141414] cursor-pointer flex justify-between items-center list-none">
                  {faq.q}
                  <Plus className="w-5 h-5 text-[#00A650] group-open:rotate-45 transition-transform" />
                </summary>
                <div className="px-8 pb-8 text-gray-500 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
