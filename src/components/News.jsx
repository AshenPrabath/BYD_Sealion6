import { motion } from 'framer-motion';

const newsItems = [
  {
    category: "Innovation",
    title: "BYD Unveils the All-New Sealion 6 with Extended Range",
    description: "Experience the next evolution of sustainable mobility with our new DM-i technology, offering unmatched efficiency and performance.",
    date: "April 15, 2026"
  },
  {
    category: "Technology",
    title: "New Blade Battery Advancements to Enhance Efficiency",
    description: "Our ongoing commitment to battery research brings the next generation of Blade Battery tech, delivering higher energy density.",
    date: "March 28, 2026"
  },
  {
    category: "Corporate",
    title: "BYD Launches Innovative Hybrid Model for Urban Commuters",
    description: "The perfect blend of electric performance and hybrid practicality, tailored for modern city driving.",
    date: "March 10, 2026"
  }
];

export default function News() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary max-w-sm">Stay Connected with BYD's Latest News and Updates</h2>
          <p className="text-secondary text-sm max-w-md">
            Stay up to date with our newest products, groundbreaking technology advancements, and global impact as we drive towards a greener future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#18181b] rounded-3xl p-8 flex flex-col h-[400px] text-white relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-[10px] uppercase tracking-widest text-white/50 mb-4">{item.category}</div>
              <h3 className="text-xl font-semibold mb-4 leading-snug">{item.title}</h3>
              <p className="text-white/70 text-sm font-light mb-auto">{item.description}</p>
              
              <div className="flex justify-between items-end mt-6">
                <span className="text-[10px] uppercase tracking-widest text-white/40">{item.date}</span>
                <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 7H13M13 7L7 1M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
