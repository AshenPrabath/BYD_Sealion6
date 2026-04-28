import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        
        {/* Left Links */}
        <div className="hidden md:flex space-x-12 text-xs font-bold text-black/60 tracking-[0.2em] uppercase w-1/3">
          <a href="#about" className="hover:text-black transition-colors">About</a>
          <a href="#models" className="hover:text-black transition-colors">Car Models</a>
        </div>
        
        {/* Logo */}
        <div className="w-1/3 flex justify-center cursor-pointer">
          <img src="/images/byd-logo.png" alt="BYD" className="h-[60px] md:h-[80px] w-auto object-contain" />
        </div>

        {/* Right Links */}
        <div className="hidden md:flex space-x-12 text-xs font-bold text-black/60 tracking-[0.2em] uppercase w-1/3 justify-end items-center">
          <a href="#preorder" className="hover:text-black transition-colors">Preorder</a>
          <a href="#contact" className="hover:text-black transition-colors">Contact</a>
        </div>

        <button className="md:hidden text-black" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-50 flex flex-col p-6 text-black"
          >
            <div className="flex justify-between items-center mb-12">
              <img src="/images/byd-logo.png" alt="BYD" className="h-[80px] w-auto object-contain" />
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex flex-col space-y-8 text-xl font-light tracking-[0.2em] uppercase">
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#models" onClick={() => setMobileMenuOpen(false)}>Car Models</a>
              <a href="#preorder" onClick={() => setMobileMenuOpen(false)}>Preorder</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
