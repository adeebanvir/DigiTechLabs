import { Link } from 'react-router-dom';
import { Cpu, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#00A650] rounded-lg flex items-center justify-center">
                <Cpu className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                DigiTech<span className="text-[#00A650]">Labs</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              Defining the future of consumer tech. We craft premium gadgets that blend cutting-edge performance with minimalist design.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-1.5 bg-white/5 rounded-lg hover:bg-[#00A650] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-1.5 bg-white/5 rounded-lg hover:bg-[#00A650] transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-1.5 bg-white/5 rounded-lg hover:bg-[#00A650] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link to="/shop" className="hover:text-[#00A650] transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-[#00A650] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-[#00A650] transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop" className="hover:text-[#00A650] transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link to="/contact" className="hover:text-[#00A650] transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-[#00A650] transition-colors">About Story</Link></li>
              <li><a href="#" className="hover:text-[#00A650] transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-[#00A650] transition-colors">Refunds & Returns</a></li>
              <li><a href="#" className="hover:text-[#00A650] transition-colors">Warranty Info</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-xs mb-4">Join our mailing list for exclusive launches.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#00A650] transition-colors"
              />
              <button className="absolute right-1.5 top-1.5 bg-[#00A650] p-1 rounded-md hover:bg-[#008a42] transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[9px] uppercase tracking-widest gap-4">
          <p>© 2026 DigiTechLabs. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
