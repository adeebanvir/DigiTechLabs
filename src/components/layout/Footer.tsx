import { Link } from 'react-router-dom';
import { Cpu, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-white pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#00A650] rounded-lg flex items-center justify-center">
                <Cpu className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                DigiTech<span className="text-[#00A650]">Labs</span>
              </span>
            </Link>
            <p className="text-gray-400 text-[11px] leading-relaxed max-w-xs">
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
            <h4 className="text-sm font-semibold mb-2">Explore</h4>
            <ul className="space-y-1.5 text-gray-400 text-[11px]">
              <li><Link to="/shop" className="hover:text-[#00A650] transition-colors">All Products</Link></li>
              <li>
                <Link 
                  to="/#featured-innovations" 
                  onClick={(e) => {
                    if (window.location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('featured-innovations')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-[#00A650] transition-colors"
                >
                  Innovations
                </Link>
              </li>
              <li><Link to="/shop?filter=new" className="hover:text-[#00A650] transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?filter=bestseller" className="hover:text-[#00A650] transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Support</h4>
            <ul className="space-y-1.5 text-gray-400 text-[11px]">
              <li><Link to="/contact" className="hover:text-[#00A650] transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-[#00A650] transition-colors">About Story</Link></li>
              <li><Link to="/policies/shipping" className="hover:text-[#00A650] transition-colors">Shipping Policy</Link></li>
              <li><Link to="/policies/refunds" className="hover:text-[#00A650] transition-colors">Refunds & Returns</Link></li>
              <li><Link to="/policies/warranty" className="hover:text-[#00A650] transition-colors">Warranty Info</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Stay Updated</h4>
            <p className="text-gray-400 text-[11px] mb-3">Join our mailing list for exclusive launches.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-[11px] focus:outline-none focus:border-[#00A650] transition-colors"
              />
              <button className="absolute right-1 top-1 bg-[#00A650] p-1 rounded-md hover:bg-[#008a42] transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[9px] uppercase tracking-widest gap-2">
          <p>© 2026 DigiTechLabs. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/policies/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/policies/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/policies/warranty" className="hover:text-white transition-colors">Cookies & Warranty</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
