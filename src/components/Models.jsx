import { motion } from 'framer-motion';

const models = [
  {
    id: 'sealion6',
    name: 'Sealion 6',
    tagline: 'Premium Plug-in Hybrid SUV',
    image: '/images/hero-car.png',
    status: 'Available Now',
    active: true
  },
  {
    id: 'seal',
    name: 'BYD SEAL',
    tagline: 'Performance Electric Sedan',
    image: '/images/models/seal-placeholder.jpg',
    status: 'Coming Soon 2026',
    active: false
  },
  {
    id: 'atto3',
    name: 'BYD ATTO 3',
    tagline: 'Smart Electric SUV',
    image: '/images/models/atto3-placeholder.jpg',
    status: 'Coming Soon 2026',
    active: false
  }
];

export default function Models() {
  return (
    <section id="models" className="py-24 bg-white text-black overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">The Lineup.</h2>
            <p className="font-body text-gray-500 text-lg md:text-xl">
              Experience the pinnacle of electric and hybrid technology. Designed for the future, ready for today.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {models.map((model, idx) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] bg-gray-50 rounded-[30px] overflow-hidden mb-6 flex items-center justify-center p-8 transition-all duration-500 group-hover:bg-gray-100">
                <img 
                  src={model.image} 
                  alt={model.name} 
                  className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 ${!model.active ? 'grayscale opacity-50' : ''}`}
                />
                {!model.active && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/5 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-black/10">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold uppercase tracking-tight">{model.name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${model.active ? 'text-green-600' : 'text-gray-400'}`}>
                    {model.status}
                  </span>
                </div>
                <p className="font-body text-gray-500">{model.tagline}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
