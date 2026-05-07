import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'dtl-001',
    name: 'Acoustic X1 Pro',
    description: 'Precision-engineered wireless headphones with hybrid active noise cancellation and 40-hour battery life.',
    price: 349.99,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
    rating: 4.9,
    reviews: 128,
    features: [
      'Hybrid Active Noise Cancellation',
      'High-Resolution Audio',
      '40-hour Battery Life',
      'Touch Controls',
      'Premium Memory Foam Earcups'
    ],
    specs: {
      'Driver Size': '40mm',
      'Frequency Response': '10Hz - 40kHz',
      'Bluetooth Version': '5.2',
      'Charging Time': '2 Hours',
      'Weight': '250g'
    },
    isBestSeller: true,
    stock: 15,
    status: 'published',
    sku: 'DTL-ACX1'
  },
  {
    id: 'dtl-002',
    name: 'Lumix Watch Series 4',
    description: 'The ultimate fitness companion with advanced health monitoring and always-on retina display.',
    price: 299.00,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1544117518-30dd5f27304d?auto=format&fit=crop&q=80&w=1000',
    rating: 4.8,
    reviews: 85,
    features: [
      'Heart Rate Monitor',
      'ECG & Blood Oxygen Tracking',
      'Always-on AMOLED Display',
      'Water Resistant up to 50m',
      'Seamless Mobile Integration'
    ],
    specs: {
      'Display': 'Retina AMOLED',
      'Battery Life': 'Up to 5 Days',
      'Case Material': 'Aerospace Grade Aluminum',
      'GPS': 'Built-in',
      'Storage': '32GB'
    },
    isNew: true,
    stock: 24,
    status: 'published',
    sku: 'DTL-LWS4'
  },
  {
    id: 'dtl-003',
    name: 'Zenith Pocket 12',
    description: 'A compact smartphone powerhouse featuring our latest Pro-Lens system and Super-Reflex display.',
    price: 899.00,
    category: 'Smaprtphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000',
    rating: 4.7,
    reviews: 56,
    features: [
      '50MP Triple Camera System',
      '6.1-inch Super-Reflex Display',
      'A15 Bionic Processor',
      'Ceramic Shield Protection',
      'Fast Wireless Charging'
    ],
    specs: {
      'Processor': 'Octa-core 3.2GHz',
      'RAM': '12GB',
      'Storage': '256GB',
      'Battery': '4500mAh',
      'Camera': '50MP + 12MP + 12MP'
    },
    stock: 9,
    status: 'published',
    sku: 'DTL-ZP12'
  },
  {
    id: 'dtl-004',
    name: 'NeoCharger Pad',
    description: 'Ultra-thin wireless charging pad with intelligent heat management and fast charging for all devices.',
    price: 49.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1586810165616-94c631fc2f79?auto=format&fit=crop&q=80&w=1000',
    rating: 4.6,
    reviews: 210,
    features: [
      '15W Fast Wireless Charging',
      'Universal Compatibility',
      'Anti-slip Surface',
      'Intelligent LED Indicator',
      'Overheating Protection'
    ],
    specs: {
      'Input': 'USB-C',
      'Output': 'Up to 15W',
      'Material': 'Soft-touch silicone',
      'Dimensions': '10cm x 10cm x 0.8cm',
      'Weight': '85g'
    },
    stock: 50,
    status: 'published',
    sku: 'DTL-NCP1'
  }
];
