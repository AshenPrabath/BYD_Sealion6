import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full flex flex-col items-center bg-white overflow-hidden pb-12 pt-32 h-[100vh] min-h-[800px]">
      
      {/* Split Background (Top Half Grayish White, Bottom Half White) */}
      <div className="absolute inset-0 z-0 flex flex-col">
        <div className="w-full h-[42%] md:h-1/2 bg-[#f0f0f0]"></div>
        <div className="w-full h-[58%] md:h-1/2 bg-white"></div>
      </div>

      {/* Huge Background Text */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center mt-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-black text-xl sm:text-3xl md:text-5xl font-bold tracking-[0.2em] mb-0 uppercase z-10 text-center max-w-full overflow-hidden"
        >
          BYD SEALION 6
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-black/[0.04] text-[15vw] md:text-[200px] font-black tracking-tighter leading-none select-none text-center mt-2 md:mt-4 whitespace-nowrap"
        >
          LIMITLESS
        </motion.h1>
      </div>

      {/* Car Image Slot (Overlapping the text) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute z-20 top-[40%] md:top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[840px] px-4 pointer-events-none"
      >
        {/* User will place a transparent PNG of the car here */}
        <img 
          src="/images/hero-car.png" 
          alt="BYD Sealion 6" 
          className="w-full h-auto object-contain drop-shadow-2xl"
          onError={(e) => {
            // Optional fallback if the image is missing, a transparent 1x1 pixel or placeholder
            e.target.style.display = 'none';
          }}
        />
      </motion.div>

      {/* Stats row */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 w-full max-w-[1200px] px-8 grid grid-cols-2 gap-y-6 md:flex md:justify-between items-end text-black/90">
        <Stat label="Range (Combined)" value="1100 KM" delay={0.4} />
        <Stat label="Top Speed" value="180 KM/H" delay={0.5} />
        <Stat label="Maximum Torque" value="550 Nm" delay={0.6} />
        <Stat label="Battery" value="18.3 KWH" delay={0.7} />
      </div>

      {/* The White curved area at the bottom intersecting the hero */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[150px] bg-white rounded-t-[50%] z-10 translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-full h-[75px] bg-white z-10"></div>

      {/* Black Circular Button floating on the curve */}
      <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 z-30 flex justify-center w-full">
        <a href="#about" className="w-14 h-14 bg-[#111] rounded-full flex items-center justify-center text-white hover:bg-black transition-colors shadow-xl">
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>

    </section>
  );
}

function Stat({ label, value, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col"
    >
      <span className="text-[10px] md:text-xs tracking-[0.1em] text-black/40 mb-2 uppercase font-bold">{label}</span>
      <span className="text-xl md:text-3xl font-bold tracking-tight text-black">{value}</span>
    </motion.div>
  );
}
