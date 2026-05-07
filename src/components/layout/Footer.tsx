import { Link } from 'react-router-dom';
import { Cpu, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#00A650] rounded-xl flex items-center justify-center">
                <Cpu className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                DigiTech<span className="text-[#00A650]">Labs</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Defining the future of consumer tech. We craft premium gadgets that blend cutting-edge performance with minimalist design.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-[#00A650] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-[#00A650] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-[#00A650] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Explore</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/shop" className="hover:text-[#00A650] transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-[#00A650] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-[#00A650] transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop" className="hover:text-[#00A650] transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/contact" className="hover:text-[#00A650] transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-[#00A650] transition-colors">About Story</Link></li>
              <li><a href="#" className="hover:text-[#00A650] transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-[#00A650] transition-colors">Refunds & Returns</a></li>
              <li><a href="#" className="hover:text-[#00A650] transition-colors">Warranty Info</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-6">Join our mailing list for exclusive launches and tech insights.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#00A650] transition-colors"
              />
              <button className="absolute right-2 top-2 bg-[#00A650] p-1.5 rounded-lg hover:bg-[#008a42] transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[10px] uppercase tracking-widest gap-4">
          <p>© 2026 DigiTechLabs. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
