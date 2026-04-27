import { motion } from 'framer-motion';

export default function BatteryTech() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[40px] overflow-hidden relative aspect-[21/9] bg-[#111] group"
        >
          <img 
            src="/images/battery/blade-battery.jpg" 
            alt="BYD Blade Battery Technology" 
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
               </svg>
             </button>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h3 className="text-3xl font-semibold text-primary mb-2">BYD Blade Battery</h3>
            <p className="text-secondary text-sm">Ultra-safe, highly efficient, and designed to last.</p>
          </div>
          <p className="text-secondary text-sm max-w-lg">
            The revolutionary Blade Battery is structurally stronger and significantly safer than conventional lithium-ion batteries. It redefines safety standards for the entire EV industry.
          </p>
          <button className="flex items-center space-x-2 text-sm font-medium border border-gray-300 rounded-full px-6 py-2 hover:bg-black hover:text-white transition-colors">
            <span>Learn More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
