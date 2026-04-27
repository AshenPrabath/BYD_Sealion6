import { motion } from 'framer-motion';

export default function FeatureGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">Business Class Inspired,<br/>For A Comfortable Ride</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100 group relative"
          >
            <img 
              src="/images/gallery/gallery-taillights.jpg" 
              alt="Rear tail light" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl overflow-hidden aspect-[4/3] bg-gray-100 group relative"
          >
            <img 
              src="/images/gallery/gallery-doors.jpg" 
              alt="Doors open" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-semibold text-xl mb-2">Premium Elegance and Innovation</h3>
              <p className="text-white/80 text-sm max-w-md">Designed for both driver and passenger comfort, offering a serene space for your daily commute.</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden aspect-[16/9] bg-gray-100 group relative flex items-center justify-center"
          >
            <img 
              src="/images/gallery/gallery-interior-seats.jpg" 
              alt="Interior seating" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl overflow-hidden aspect-[16/9] bg-gray-100 group relative flex items-center justify-center"
          >
            <img 
              src="/images/gallery/gallery-interior-dash.jpg" 
              alt="Interior detailing" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
