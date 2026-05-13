import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ArrowRight, Zap, ShieldCheck, Truck, RotateCcw, Loader2, ChevronLeft, ChevronRight, Laptop, Headphones, Glasses, Keyboard, Gamepad2, Watch, Home as HomeIcon, Shield, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, AppSetting } from '../types';
import { productService, settingsService } from '../services/dataService';
import ProductCard from '../components/products/ProductCard';
import { useAuth } from '../context/AuthContext';

const DEFAULT_BANNERS = [
  {
    id: '1',
    title: 'Spring Collection 2026',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200',
    link: '/shop?category=Audio',
    createdAt: new Date('2026-01-01')
  },
  {
    id: '2',
    title: 'Elite Gaming Gear',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600',
    link: '/shop?category=Gaming',
    createdAt: new Date('2026-01-02')
  },
  {
    id: '3',
    title: 'Smart Office Pro',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600',
    link: '/shop?category=Work',
    createdAt: new Date('2026-01-03')
  },
  {
    id: '4',
    title: 'Next-Gen Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    link: '/shop?category=Wearables',
    createdAt: new Date('2026-01-04')
  },
  {
    id: '5',
    title: 'Immersive Visuals',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600',
    link: '/shop?category=Visual',
    createdAt: new Date('2026-01-05')
  }
];

const DEFAULT_SETTINGS: Omit<AppSetting, 'id'> = {
  whatWeAreTitle: 'Simple Gear.',
  whatWeAreHighlight: 'Better Life.',
  whatWeAreDescription: 'We curate high-performance, minimalist tech that integrates seamlessly into your daily workflow. No clutter, just quality.',
  offers: ['New Arrivals', 'Best Sellers', 'Flash Sale', 'Innovation', 'Spring Collection', 'Echo Series', 'Pro Grade', 'Limited Edition'],
  banners: DEFAULT_BANNERS,
  limitBanners: false,
  updatedAt: new Date()
};

export default function Home() {
  const { isAdmin } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
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
      // ... (existing seeding logic)
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
            reviews: 128,
            isReviewsEnabled: true,
            isFeatured: true,
            stock: 15,
            status: 'published',
            sku: 'INF-SHB',
            features: ['WiFi 7', 'Local Computing', 'Threat Detection'],
            specs: { 'CPU': 'Quad-core AI', 'RAM': '16GB', 'Storage': '1TB NVMe' }
          },
          {
            productId: 'ultra-wide-monitor-z',
            name: 'UltraWide Monitor Z',
            description: '49-inch curved display for the ultimate multitasking and immersive gaming experience.',
            price: 1199.99,
            discount: 150,
            category: 'Desktop',
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600',
            rating: 4.9,
            reviews: 210,
            isReviewsEnabled: true,
            isFeatured: true,
            isBestSeller: true,
            stock: 20,
            status: 'published',
            sku: 'DSK-UWZ',
            features: ['240Hz Refresh', 'DUAL QHD', 'VESA Mount'],
            specs: { 'Panel': 'Mini-LED', 'Brightness': '1000 nits', 'Ports': 'HDMI 2.1, DP 1.4' }
          },
          {
            productId: 'mechanical-kb-pro',
            name: 'Mechanical KB Pro',
            description: 'Custom-tuned mechanical keyboard with hot-swappable switches and gasket mount.',
            price: 189.00,
            discount: 0,
            category: 'Work',
            image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600',
            rating: 4.8,
            reviews: 340,
            isReviewsEnabled: true,
            isFeatured: true,
            stock: 100,
            status: 'published',
            sku: 'WORK-MKP',
            features: ['Gasket Mount', 'QMK/VIA', 'RGB Per-key'],
            specs: { 'Switches': 'Gateron Oil Kings', 'Material': 'Aluminum', 'Weight': '2.4kg' }
          },
          {
            productId: 'portable-ssd-nitro',
            name: 'Portable SSD Nitro',
            description: 'Credit card sized SSD with insane read/write speeds for creators on the go.',
            price: 159.00,
            discount: 20,
            category: 'Power',
            image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?auto=format&fit=crop&q=80&w=600',
            rating: 4.7,
            reviews: 87,
            isReviewsEnabled: true,
            isFeatured: false,
            isBestSeller: true,
            stock: 200,
            status: 'published',
            sku: 'PWR-SSD-N',
            features: ['USB 4.0', 'Drop Proof', 'Encryption'],
            specs: { 'Speed': '3500MB/s', 'Capacity': '2TB', 'Weight': '40g' }
          },
          {
            productId: 'smart-ring-v1',
            name: 'Smart Ring V1',
            description: 'Discreet health monitoring in a premium titanium ring. Sleep, heart rate, and more.',
            price: 299.00,
            discount: 0,
            category: 'Wearables',
            image: 'https://images.unsplash.com/photo-1601287113101-72944b2f883b?auto=format&fit=crop&q=80&w=600',
            rating: 4.6,
            reviews: 54,
            isReviewsEnabled: true,
            isFeatured: true,
            stock: 45,
            status: 'published',
            sku: 'WEAR-SRV',
            features: ['7-Day Battery', 'Titanium build', 'No Subscription'],
            specs: { 'Material': 'Grade 5 Titanium', 'Waterproof': '100m', 'Sensors': 'PPG, Temp' }
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

    // Fetch all products for the mini-shop and new arrivals
    productService.getAllProducts().then(all => {
      setAllProducts(all);
      
      // Calculate new arrivals (latest 5)
      const sorted = [...all].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      setNewArrivals(sorted.slice(0, 5));
      
      setLoadingAll(false);
    });

    // Fetch Settings
    settingsService.getSettings('home').then(data => {
      if (!data) {
        if (isAdmin) {
          settingsService.updateSettings('home', DEFAULT_SETTINGS).then(() => {
            settingsService.getSettings('home').then(refreshed => {
              setSettings(refreshed);
              setLoadingSettings(false);
            }).catch(() => {
              setSettings({ id: 'home', ...DEFAULT_SETTINGS } as AppSetting);
              setLoadingSettings(false);
            });
          }).catch(() => {
            setSettings({ id: 'home', ...DEFAULT_SETTINGS } as AppSetting);
            setLoadingSettings(false);
          });
        } else {
          setSettings({ id: 'home', ...DEFAULT_SETTINGS } as AppSetting);
          setLoadingSettings(false);
        }
      } else {
        // Double check for empty banners/offers even if doc exists
        const mergedData = {
          ...data,
          banners: (data.banners && data.banners.length > 0) ? data.banners : DEFAULT_BANNERS,
          offers: (data.offers && data.offers.length > 0) ? data.offers : DEFAULT_SETTINGS.offers,
          limitBanners: data.limitBanners ?? false
        };
        setSettings(mergedData);
        setLoadingSettings(false);
      }
    }).catch(err => {
      console.error("Failed to fetch settings, using defaults", err);
      setSettings({ id: 'home', ...DEFAULT_SETTINGS } as AppSetting);
      setLoadingSettings(false);
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
      {/* Dynamic Banners Section (Screenshot Style) */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Promotional Banners */}
            {settings?.banners?.slice().sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
              return dateB.getTime() - dateA.getTime();
            }).slice(0, settings?.limitBanners ? 4 : undefined).map((banner, i) => (
              <motion.div 
                key={banner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-[200px] relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link to={banner.link} className="block w-full h-full">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white text-lg font-bold tracking-tight mb-1">{banner.title}</h3>
                    <div className="text-white/80 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center">
                      Shop Now <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {(!settings?.banners || settings.banners.length === 0) && (
              <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Offers Coming Soon</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Categories (Screenshot Style) */}
      <section className="bg-[#F8F9FA] py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#141414] border-l-4 border-[#00A650] pl-4">Top Categories</h2>
            <Link to="/shop" className="text-xs font-bold text-[#00A650] uppercase tracking-widest hover:underline">See All</Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2 md:gap-4">
            {[
              { name: 'Laptop', icon: <Laptop className="w-8 h-8" />, label: 'LAPTOP' },
              { name: 'Audio', icon: <Headphones className="w-8 h-8" />, label: 'AUDIO' },
              { name: 'Visual', icon: <Glasses className="w-8 h-8" />, label: 'VISUAL' },
              { name: 'Power', icon: <Zap className="w-8 h-8" />, label: 'POWER' },
              { name: 'Work', icon: <Keyboard className="w-8 h-8" />, label: 'WORK' },
              { name: 'Gaming', icon: <Gamepad2 className="w-8 h-8" />, label: 'GAMING' },
              { name: 'Wearables', icon: <Watch className="w-8 h-8" />, label: 'WEARABLES' },
              { name: 'Smart Home', icon: <HomeIcon className="w-8 h-8" />, label: 'SMART...' },
              { name: 'Security', icon: <Shield className="w-8 h-8" />, label: 'SECURITY' },
              { name: 'Desktop', icon: <Monitor className="w-8 h-8" />, label: 'DESKTOP' }
            ].map((cat, i) => (
              <Link 
                key={cat.name} 
                to={`/shop?category=${cat.name}`}
                className="group flex flex-col items-center p-4 bg-white rounded-[2rem] border border-gray-100/50 hover:border-[#0081C9] hover:shadow-xl transition-all duration-500 shadow-sm"
              >
                <div className="mb-4 text-[#141414] transition-all transform group-hover:scale-110 group-hover:text-[#0081C9]">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-black text-[#0081C9] uppercase tracking-[0.15em] text-center">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Miniaturized Shop Hero */}
      <section className="pt-12 pb-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-6">
            <div className="max-w-xl">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#00A650] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 block"
              >
                Limited Offers & What We Are
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-[#141414] leading-[0.9]"
              >
                {settings?.whatWeAreTitle || 'Simple Gear.'}<br />
                <span className="text-[#00A650]">{settings?.whatWeAreHighlight || 'Better Life.'}</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-3 text-lg text-gray-500 leading-relaxed"
              >
                {settings?.whatWeAreDescription || 'We curate high-performance, minimalist tech that integrates seamlessly into your daily workflow. No clutter, just quality.'}
              </motion.p>
            </div>
            <div className="flex flex-wrap gap-3">
              {(settings?.offers || ['New Arrivals', 'Best Sellers', 'Flash Sale', 'Innovation']).map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="px-4 py-2 bg-gray-50 text-gray-500 rounded-full text-xs font-bold uppercase tracking-widest border border-gray-100"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>

          {loadingAll ? (
             <div className="py-24 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Opening the Vault...</p>
              </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {allProducts.slice(0, itemsPerPage * 4).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % itemsPerPage) * 0.1 }}
                  viewport={{ once: true }}
                >
                   <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link 
              to="/shop" 
              className="inline-flex items-center px-8 py-4 bg-[#141414] text-white rounded-2xl font-bold hover:bg-[#00A650] transition-all duration-300 group"
            >
              Explore Full Catalog
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-[#00A650] text-[11px] font-bold uppercase tracking-widest mb-4 block">
                Fresh From The Lab
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#141414]">
                New <br /> Arrivals.
              </h2>
            </div>
            <Link to="/shop" className="text-[#141414] font-bold hover:text-[#00A650] transition-colors flex items-center">
              View All New Gear <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {loadingAll ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest">Unboxing Latest Gear...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {newArrivals.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
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
