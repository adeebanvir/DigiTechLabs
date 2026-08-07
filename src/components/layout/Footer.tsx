import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Video, Mail, Share2 } from 'lucide-react';
import Logo from '../Logo';
import { settingsService } from '../../services/dataService';
import { AppSetting, SocialLink } from '../../types';

const ICON_MAP: Record<string, React.ElementType> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Video,
  github: Github,
};

export default function Footer() {
  const [settings, setSettings] = useState<AppSetting | null>(null);

  useEffect(() => {
    settingsService.getSettings('home').then(data => {
      if (data) setSettings(data);
    }).catch(err => console.error("Failed to load footer settings", err));
  }, []);

  const footerDescription = settings?.footerText || "Defining the future of consumer tech. We craft premium gadgets that blend cutting-edge performance with minimalist design.";

  const socialLinks: SocialLink[] = (settings?.socialLinks && settings.socialLinks.length > 0)
    ? settings.socialLinks.slice(0, 4)
    : [
        { id: '1', platform: 'facebook', url: '#' },
        { id: '2', platform: 'twitter', url: '#' },
        { id: '3', platform: 'instagram', url: '#' },
      ];

  return (
    <footer className="bg-[#141414] text-white pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center">
              <Logo variant="light" className="h-9" />
            </Link>
            <p className="text-gray-400 text-[11px] leading-relaxed max-w-xs">
              {footerDescription}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const IconComp = ICON_MAP[social.platform] || Share2;
                return (
                  <a 
                    key={social.id} 
                    href={social.url.startsWith('http') ? social.url : '#'} 
                    target={social.url.startsWith('http') ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white/5 rounded-lg hover:bg-[#00A650] transition-colors"
                    title={social.platform}
                  >
                    <IconComp className="w-4 h-4" />
                  </a>
                );
              })}
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
