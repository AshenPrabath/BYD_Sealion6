import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="pt-24 pb-16 px-6 max-w-7xl mx-auto bg-background rounded-[40px] relative z-10 -mt-10">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-primary"
          >
            About BYD Sealion 6
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-secondary/80 font-light mb-10 max-w-lg leading-relaxed text-sm"
          >
            We are an engineering team with an obsession for driving technology and efficiency, with an aim to provide a design that is smarter, more connected, more dynamic with distinctive aesthetics while still being functional.
          </motion.p>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <StatItem value="90+" label="Global Presence" delay={0.2} />
            <StatItem value="500+" label="Active Patents" delay={0.3} />
            <StatItem value="10K" label="Driven Distance" delay={0.4} />
          </div>

          <motion.button 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-primary text-white rounded-full px-6 py-3 text-sm font-medium tracking-wide flex items-center space-x-2 hover:bg-black transition-colors"
          >
            <span>Explore</span>
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5H9M9 5L5 1M9 5L5 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </motion.button>
        </div>

        <div className="w-full lg:w-1/2">
          <motion.img 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            src="/images/about/about-exterior.jpg" 
            alt="BYD Sealion Rear" 
            className="w-full h-auto object-cover rounded-2xl"
          />
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
