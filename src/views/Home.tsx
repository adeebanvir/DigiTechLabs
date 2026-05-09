import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ArrowRight, Zap, ShieldCheck, Truck, RotateCcw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/dataService';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(2);
      else if (window.innerWidth < 1024) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    productService.getFeaturedProducts().then(data => {
      if (data.length === 0) {
        // Seed some high-end products if the DB is empty
        const initialProducts: Omit<Product, 'id'>[] = [
          {
            productId: 'acoustic-x1-pro',
            name: 'Acoustic X1 Pro',
            description: 'Premium active noise-cancelling headphones with neural sound engine and 60h battery life.',
            price: 349.99,
            discount: 0,
            category: 'Audio',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
            rating: 4.9,
            reviews: 128,
            isReviewsEnabled: true,
            isNew: true,
            isFeatured: true,
            isBestSeller: true,
            stock: 50,
            status: 'published',
            sku: 'AUD-X1P',
            features: ['Neural ANC', '60h Battery', 'Hi-Res Audio'],
            specs: { 'Driver': '40mm Dynamic', 'Connectivity': 'BT 5.2', 'Weight': '250g' }
          },
          {
            productId: 'vision-glass-gen-2',
            name: 'Vision Glass Gen 2',
            description: 'The ultimate AR experience with ultra-vivid OLED displays and spatial audio integration.',
            price: 899.00,
            discount: 0,
            category: 'Visual',
            image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600',
            rating: 4.8,
            reviews: 45,
            isReviewsEnabled: true,
            isNew: true,
            isFeatured: true,
            stock: 25,
            status: 'published',
            sku: 'VIS-G2',
            features: ['8K OLED', 'Spatial Tracking', 'Hand Gestures'],
            specs: { 'FOV': '110 degrees', 'Weight': '350g', 'Battery': '4h External' }
          },
          {
            productId: 'neocharger-pad',
            name: 'NeoCharger Pad',
            description: 'Minimalist triple-device wireless charging station with magnetic alignment technology.',
            price: 129.99,
            discount: 0,
            category: 'Power',
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600',
            rating: 4.7,
            reviews: 89,
            isReviewsEnabled: true,
            isFeatured: true,
            isBestSeller: true,
            stock: 100,
            status: 'published',
            sku: 'PWR-NCP',
            features: ['15W Fast Charge', 'MagSafe Ready', 'USB-C In'],
            specs: { 'Material': 'Aluminum', 'Ports': '1 x USB-C', 'Power': '45W Peak' }
          },
          {
            productId: 'smart-desk-lamp-x',
            name: 'Smart Desk Lamp X',
            description: 'Adaptive workspace lighting that responds to your circadian rhythm and environment.',
            price: 199.00,
            discount: 0,
            category: 'Smart Home',
            image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=600',
            rating: 4.6,
            reviews: 34,
            isReviewsEnabled: true,
            isFeatured: true,
            stock: 40,
            status: 'published',
            sku: 'HOME-SLX',
            features: ['RGBW Support', 'Voice Control', 'Auto Dimming'],
            specs: { 'Brightness': '800 Lumens', 'CRI': '>95', 'Life': '50,000 hrs' }
          },
          {
            productId: 'focus-watch-s',
            name: 'Focus Watch S',
            description: 'The ultimate minimalist wearable focused on health, sleep, and recovery metrics.',
            price: 249.99,
            discount: 0,
            category: 'Wearables',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
            rating: 4.7,
            reviews: 215,
            isReviewsEnabled: true,
            isFeatured: true,
            isBestSeller: true,
            stock: 60,
            status: 'published',
            sku: 'WEAR-FWS',
            features: ['SPO2 Sensor', '7-Day Battery', 'Waterproof'],
            specs: { 'Case': 'Titanium', 'Display': 'OLED Always-on', 'Weight': '45g' }
          },
          {
            productId: 'zen-pods-max',
            name: 'Zen Pods Max',
            description: 'Immersive open-ear earbuds for those who want to stay connected to their world.',
            price: 179.00,
            discount: 0,
            category: 'Audio',
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
            rating: 4.5,
            reviews: 67,
            isReviewsEnabled: true,
            isFeatured: true,
            stock: 80,
            status: 'published',
            sku: 'AUD-ZPM',
            features: ['Open-Ear Design', 'Multipoint', 'Wind Cancellation'],
            specs: { 'Battery': '30h total', 'Water': 'IPX4', 'Charge': 'Wireless' }
          },
          {
            productId: 'e-ink-reader-pro',
            name: 'E-Ink Reader Pro',
            description: 'High-contrast e-ink tablet for focused reading and distraction-free writing.',
            price: 299.99,
            discount: 0,
            category: 'Work',
            image: 'https://images.unsplash.com/photo-1544244015-0cd4b3ff369d?auto=format&fit=crop&q=80&w=600',
            rating: 4.8,
            reviews: 54,
            isReviewsEnabled: true,
            isFeatured: true,
            stock: 30,
            status: 'published',
            sku: 'WORK-EIRP',
            features: ['300 DPI', 'Stylus Included', 'Month Battery'],
            specs: { 'Storage': '64GB', 'OS': 'Android E-Ink', 'Screen': '10.3 inch' }
          },
          {
            productId: 'spatial-hub',
            name: 'Spatial Hub',
            description: 'The center of your smart office, connecting all devices with sub-millisecond latency.',
            price: 599.00,
            discount: 0,
            category: 'Infrastructure',
            image: 'https://images.unsplash.com/photo-1558239023-500742f1cf68?auto=format&fit=crop&q=80&w=600',
            rating: 4.9,
            reviews: 12,
            isReviewsEnabled: true,
            isFeatured: true,
            stock: 15,
            status: 'published',
            sku: 'INF-SHB',
            features: ['WiFi 7', 'Local Computing', 'Threat Detection'],
            specs: { 'CPU': 'Quad-core AI', 'RAM': '16GB', 'Storage': '1TB NVMe' }
          }
        ];
        
        Promise.all(initialProducts.map(p => productService.addProduct(p))).then(() => {
          productService.getFeaturedProducts().then(refreshedData => {
            setFeaturedProducts(refreshedData);
            setLoading(false);
          });
        });
      } else {
        setFeaturedProducts(data);
        setLoading(false);
      }
    });

    // Fetch actual trending products (best sellers)
    productService.getAllProducts().then(allProducts => {
      const bestSellers = allProducts.filter(p => !!p.isBestSeller).slice(0, 4);
      setTrendingProducts(bestSellers);
      setLoadingTrending(false);
    });

    // Handle hash scrolling on initial load
    if (window.location.hash === '#featured-innovations') {
      setTimeout(() => {
        document.getElementById('featured-innovations')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
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
              className="z-20 text-left"
            >
              <span className="inline-block px-4 py-1.5 bg-[#00A650]/10 text-[#00A650] text-[11px] font-bold uppercase tracking-widest rounded-full mb-8">
                Innovation First
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-[#141414] leading-[0.9] mb-8">
                The Future<br /> 
                Is <span className="text-[#00A650]">Minimal.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Experience high-performance gadgets designed to simplify your life. Discover the DigiTechLabs ecosystem today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/shop" 
                  className="px-8 py-4 bg-[#141414] text-white rounded-2xl font-bold hover:bg-[#00A650] transition-all duration-300 flex items-center justify-center group shadow-xl hover:shadow-[#00A650]/20"
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

      {/* Professional Featured Section */}
      <section id="featured-innovations" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-[#00A650]/5 rounded-[2rem] blur-2xl -z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Premium Audio"
                  className="rounded-[2.5rem] shadow-2xl w-full object-cover aspect-square md:aspect-video"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <span className="text-[#00A650] text-[11px] font-bold uppercase tracking-widest mb-6 block">
                Featured Innovation
              </span>
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-[#141414] mb-8 leading-tight">
                Mastering the <br /> <span className="text-[#00A650]">Acoustics.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
                Our latest engineering marvel features active noise cancellation powered by neural networks. Experience sound as it was meant to be heard—pure, immersive, and uncompromising.
              </p>
              <ul className="space-y-6 mb-12">
                {[
                  { title: "Pure Fidelity", desc: "40mm dynamic drivers for ultra-low distortion." },
                  { title: "Smart ANC", desc: "Adapts to your environment in real-time." },
                  { title: "60h Battery", desc: "Go weeks without reaching for a cable." }
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-[#00A650]/10 flex items-center justify-center mr-4 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#00A650]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#141414]">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link 
                to="/shop" 
                className="inline-flex items-center text-[#141414] font-bold pb-1 border-b-2 border-[#141414] hover:border-[#00A650] hover:text-[#00A650] transition-all"
              >
                Learn more about our tech <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4 md:gap-8 text-left">
            <div className="max-w-2xl">
              <span className="text-[#00A650] text-[11px] font-bold uppercase tracking-widest mb-4 block">
                Curation Excellence
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#141414]">
                Featured <br /> Selections.
              </h2>
            </div>
          </div>

          <div className="relative group/slider px-4">
            {/* Navigation Buttons on Sides */}
            <button 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-30 w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-[#00A650] hover:text-[#00A650] disabled:opacity-0 disabled:pointer-events-none transition-all shadow-xl text-[#141414] opacity-0 group-hover/slider:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentIndex(prev => Math.min(Math.max(0, featuredProducts.length - itemsPerPage), prev + 1))}
              disabled={currentIndex >= Math.max(0, featuredProducts.length - itemsPerPage)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-30 w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-[#00A650] hover:text-[#00A650] disabled:opacity-0 disabled:pointer-events-none transition-all shadow-xl text-[#141414] opacity-0 group-hover/slider:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Fetching Curation...</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <motion.div 
                  className="flex -mx-2 md:-mx-4"
                  animate={{ x: `-${currentIndex * (100 / (itemsPerPage || 4))}%` }}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                >
                  {featuredProducts.map(product => (
                    <div 
                      key={product.id} 
                      className="flex-shrink-0 px-2 md:px-4"
                      style={{ width: `${100 / (itemsPerPage || 4)}%` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="py-24 lg:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4 md:gap-8 text-left">
            <div className="max-w-2xl">
              <span className="text-[#00A650] text-[11px] font-bold uppercase tracking-widest mb-4 block">
                Popular Choice
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#141414]">
                Trending <br /> Collections.
              </h2>
            </div>
            <Link to="/shop" className="text-[#141414] font-bold hover:text-[#00A650] transition-colors flex items-center">
              Explore Store <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {loadingTrending ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Identifying Trends...</p>
              </div>
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                No trending items found
              </div>
            )}
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
