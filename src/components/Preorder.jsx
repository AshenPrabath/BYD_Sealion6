import { motion } from 'framer-motion';

export default function Preorder() {
  return (
    <section id="preorder" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          <div className="max-w-2xl text-center lg:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-tight"
            >
              Reserve your <br />
              Sealion 6 today.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-body text-gray-400 text-lg md:text-xl mb-12 max-w-lg mx-auto lg:mx-0"
            >
              Join the future of smart transportation. Preorder now and be among the first to experience the pinnacle of DM-i hybrid technology.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <button className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-all transform hover:scale-105">
                Preorder Now
              </button>
              <button className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/20 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Request a Quote
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="aspect-square bg-white/5 rounded-3xl overflow-hidden backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <img src="/images/rear-2.webp" alt="Preorder Sealion 6" className="w-full h-full object-cover" />
            </div>
            {/* Minimal floating stats */}
            <div className="absolute -top-6 -right-6 bg-white text-black px-6 py-4 rounded-2xl shadow-2xl">
              <div className="text-sm font-bold tracking-widest uppercase mb-1">Price from</div>
              <div className="text-3xl font-black tracking-tight">$48,990*</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
