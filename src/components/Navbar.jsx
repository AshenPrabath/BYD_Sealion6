import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const models = [
  { id: 'sealion6', name: 'Sealion 6', tagline: 'Premium PHEV SUV', image: '/images/hero-car.png', active: true },
  { id: 'seal', name: 'BYD SEAL', tagline: 'Electric Sedan', image: '/images/seal.png', active: false },
  { id: 'atto3', name: 'BYD ATTO 3', tagline: 'Electric SUV', image: '/images/atto.png', active: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [mobileModelsOpen, setMobileModelsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  return (
    <nav 
      className={`fixed top-0 w-full z-[150] transition-all duration-500 ${scrolled || showModels ? 'bg-white/95 backdrop-blur-md py-2 shadow-sm' : 'bg-transparent py-4'}`}
      onMouseLeave={() => setShowModels(false)}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between h-[60px]">
        
        {/* Left Links */}
        <div className="hidden md:flex items-center space-x-12 text-[10px] font-bold text-black/60 tracking-[0.2em] uppercase w-1/3">
          <a href="#about" className="hover:text-black transition-colors py-4">About</a>
          <div 
            className="relative cursor-pointer py-4 group"
            onMouseEnter={() => setShowModels(true)}
          >
            <span className={`flex items-center space-x-1 transition-colors ${showModels ? 'text-black' : 'hover:text-black'}`}>
              <span>Car Models</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showModels ? 'rotate-180' : ''}`} />
            </span>
          </div>
        </div>
        
        {/* Logo */}
        <div className="w-1/3 flex justify-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/images/byd-logo.png" alt="BYD" className="h-[40px] md:h-[55px] w-auto object-contain" />
        </div>

        {/* Right Links */}
        <div className="hidden md:flex space-x-12 text-[10px] font-bold text-black/60 tracking-[0.2em] uppercase w-1/3 justify-end items-center">
          <a href="#preorder" className="hover:text-black transition-colors py-4">Preorder</a>
          <a href="#contact" className="hover:text-black transition-colors py-4">Contact</a>
        </div>

        <button className="md:hidden text-black p-2" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Mega Menu */}
      <AnimatePresence>
        {showModels && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="hidden md:block absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-black/5 shadow-2xl py-12 px-12"
          >
            <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-12">
              {models.map((model) => (
                <div key={model.id} className="group cursor-pointer">
                  <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden mb-4 p-6 flex items-center justify-center transition-all group-hover:bg-gray-100">
                    <img 
                      src={model.image} 
                      alt={model.name} 
                      className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 ${!model.active ? 'grayscale opacity-30 brightness-[0.3]' : ''}`} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest">{model.name}</h4>
                      <p className="text-[10px] text-gray-400 font-body mt-1">{model.tagline}</p>
                    </div>
                    {!model.active && <span className="text-[8px] font-bold uppercase text-gray-400 border border-gray-200 px-2 py-1 rounded">Coming Soon</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[200] flex flex-col h-[100dvh] w-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <img src="/images/byd-logo.png" alt="BYD" className="h-[35px] w-auto object-contain" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col p-8 space-y-6">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight">About</a>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setMobileModelsOpen(!mobileModelsOpen)}
                  className="w-full flex items-center justify-between text-2xl font-bold uppercase tracking-tight"
                >
                  <span>Car Models</span>
                  <ChevronDown className={`w-6 h-6 transition-transform ${mobileModelsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileModelsOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-4 pl-4"
                    >
                      {models.map(model => (
                        <div key={model.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                          <img src={model.image} className={`w-16 h-10 object-contain ${!model.active ? 'grayscale opacity-30 brightness-[0.3]' : ''}`} alt="" />
                          <div>
                            <div className="text-sm font-bold uppercase">{model.name}</div>
                            <div className="text-[10px] text-gray-400">{model.active ? 'Available' : 'Coming Soon'}</div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="#preorder" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight">Preorder</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold uppercase tracking-tight">Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
