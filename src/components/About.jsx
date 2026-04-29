import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 max-w-[1600px] mx-auto bg-white text-black">
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
        <div className="w-full lg:w-[55%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 block">Build Your Dreams</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
              A Legacy of <br /> Innovation.
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body text-gray-500 text-lg md:text-xl mb-12 max-w-xl leading-relaxed"
          >
            BYD is a global leader in new energy technology, dedicated to technological innovations for a better life. We aim to provide designs that are smarter, more connected, and more dynamic—balancing distinctive aesthetics with uncompromising functionality.
          </motion.p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-12">
            <StatItem value="90+" label="Global Presence" delay={0.2} />
            <StatItem value="500+" label="Active Patents" delay={0.3} />
            <StatItem value="10M" label="NEV Vehicles" delay={0.4} />
          </div>

          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="group bg-black text-white rounded-full px-10 py-5 text-xs font-bold uppercase tracking-widest flex items-center space-x-4 hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
          >
            <span>Learn More</span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform group-hover:translate-x-2">
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5H9M9 5L5 1M9 5L5 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.button>
        </div>

        <div className="w-full lg:w-[35%] relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gray-100 rounded-full -z-10 blur-3xl opacity-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative rounded-[40px] overflow-hidden shadow-2xl"
          >
            <img 
              src="/images/rear-pc.jpg" 
              alt="BYD Sealion Innovation" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="text-3xl font-bold text-primary mb-1">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-secondary/70">{label}</div>
    </motion.div>
  );
}
