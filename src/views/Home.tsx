import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ArrowRight, Zap, ShieldCheck, Truck, RotateCcw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/dataService';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getFeaturedProducts().then(data => {
      setFeaturedProducts(data);
      setLoading(false);
    });
  }, []);

  const usps = [
    { icon: <Truck className="w-6 h-6" />, title: 'Expedited Delivery', desc: 'Free same-day processing on all orders.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: '2-Year Warranty', desc: 'Secure coverage on every single device.' },
    { icon: <RotateCcw className="w-6 h-6" />, title: 'Easy Returns', desc: '30-day hassle-free exchange program.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Tech Support', desc: '24/7 expert guidance for your ecosystem.' },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F5F5F0] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="z-10"
            >
              <span className="inline-block px-4 py-1.5 bg-[#00A650]/10 text-[#00A650] text-[11px] font-bold uppercase tracking-widest rounded-full mb-8">
                Innovation First
              </span>
              <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter text-[#141414] leading-[0.9] mb-8">
                The Future<br /> 
                Is <span className="text-[#00A650]">Minimal.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Experience high-performance gadgets designed to simplify your life. Discover the DigiTechLabs ecosystem today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/shop" 
                  className="px-8 py-4 bg-[#141414] text-white rounded-2xl font-bold hover:bg-[#00A650] transition-all duration-300 flex items-center justify-center group"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/about" 
                  className="px-8 py-4 border-2 border-gray-200 text-[#141414] rounded-2xl font-bold hover:border-[#141414] transition-all duration-300 text-center"
                >
                  Our Story
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="absolute inset-0 bg-[#00A650]/10 rounded-[4rem] blur-3xl -z-10 transform scale-75 translate-x-10 translate-y-10" />
              <img 
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1000" 
                alt="Featured Gadget"
                className="w-[80%] h-auto rounded-[3rem] shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* USPS */}
      <section className="py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {usps.map((usp, i) => (
              <motion.div 
                key={usp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="p-3 bg-[#F5F5F0] rounded-2xl text-[#00A650]">
                  {usp.icon}
                </div>
                <div>
                  <h4 className="font-bold text-[#141414] mb-1">{usp.title}</h4>
                  <p className="text-gray-500 text-sm">{usp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4 md:gap-8 text-left">
            <div className="max-w-2xl">
              <span className="text-[#00A650] text-[11px] font-bold uppercase tracking-widest mb-4 block">
                Curation Excellence
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#141414]">
                Trending <br /> Collections.
              </h2>
            </div>
            <Link to="/shop" className="text-[#00A650] font-bold hover:underline flex items-center justify-start">
              View all products <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
            {loading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Fetching Curation...</p>
              </div>
            ) : featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-[#141414] py-24 lg:py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-max h-full flex items-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[20rem] font-bold whitespace-nowrap">DIGITECHLABS</span>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              Trusted by Enthusiasts.
            </h2>
            <div className="flex items-center justify-center space-x-2 text-[#00A650]">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
              <span className="text-white font-bold ml-2">4.9/5 Average Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Alex Rivera', role: 'Tech Reviewer', quote: 'The build quality of the Acoustic X1 is genuinely Apple-tier. Im impressed by the attention to detail.' },
              { name: 'Sarah Chen', role: 'Digital Nomad', quote: 'Fast shipping and even better customer support. My NeoCharger Pad arrived in 24 hours!' },
              { name: 'James Wilson', role: 'Software Engineer', quote: 'Finally, a gadget store that focuses on minimalist aesthetics without compromising on raw performance.' }
            ].map((testimonial, i) => (
              <motion.div 
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10"
              >
                <p className="text-gray-300 text-lg italic mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <h5 className="text-white font-bold">{testimonial.name}</h5>
                  <p className="text-[#00A650] text-xs uppercase tracking-widest font-medium mt-1">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#00A650] rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
            <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tight mb-8 relative z-10">
              Ready to upgrade <br /> your tech ecosystem?
            </h2>
            <Link 
              to="/shop" 
              className="inline-flex items-center px-10 py-5 bg-white text-[#141414] rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl relative z-10"
            >
              Explore the Store
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
