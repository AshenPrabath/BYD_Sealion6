import { motion } from 'framer-motion';

export default function InteriorFeatures() {
  return (
    <section className="py-12 md:py-24 bg-white text-black">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Premium materials and features throughout.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Premium seating" 
            desc="Premium leather interior with 8-way power adjustable drivers seat (Premium), 6-way power adjustable driver seat (Essential) and 4-way power adjustable passenger seat. Front passengers enjoy heated & ventilated seats."
            image="/images/interior/interior-seating.jpg"
          />
          <FeatureCard 
            title="Rear comfort" 
            desc="BYD SEALION 6 rear passengers ride in comfort with manually adjustable backrest angle, dual-zone climate control with rear vents, Infinity audio 10 speaker sound system, 1 x USB-C port & 1 x USB-A port, RGB mood lighting."
            image="/images/interior/interior-rear.jpg"
          />
          <FeatureCard 
            title="Convenient features" 
            desc="2x Wireless phone charging pads, Apple Carplay® and Android Auto™, 15.6-inch (Premium) / 12.8-inch (Essential) intelligent rotating touch screen and 12.3-inch LCD instrument display. Keyless entry and go."
            image="/images/interior/interior-tech.jpg"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, desc, image }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col group cursor-pointer"
    >
      <div className="overflow-hidden rounded-xl aspect-[4/3] mb-6 bg-gray-100 relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Shown only when image is missing */}
        <div
          style={{ display: 'none' }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider">Add image to<br /><code className="text-[10px]">/images/interior/</code></span>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed font-body">{desc}</p>
    </motion.div>
  );
}
