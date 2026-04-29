import { motion } from 'framer-motion';

const features = [
  {
    title: "Electric Hybrid",
    description: "BYD DM-i technology is a PHEV system that uses a high-power motor drive and large-capacity BYD Blade battery as its primary source of power, only using the engine for assistance. This means BYD SEALION 6 can drive fully electric and when the SOC is low, the car transforms into an ultra-low fuel consumption hybrid vehicle.",
    image: "/images/features/feature-hybrid.jpg",
    reverse: false
  },
  {
    title: "Performance powerhouse",
    description: "BYD SEALION 6 Premium has a 1.5L turbo plug-in hybrid layout offering 238kW of power and 550Nm of torque mated to an AWD powertrain and 0-100km/h of just 5.9s. The BYD SEALION 6 Essential has a 1.5L plug-in hybrid layout offering 160kW of power and 300Nm of torque and FWD powertrain with a 0-100km/h time of 8.5s.",
    image: "/images/features/feature-performance.jpg",
    reverse: true
  },
  {
    title: "Safe and secure",
    description: "Enjoy all of the latest safety technology in BYD SEALION 6. Features include blind spot detection, 360° cameras, Adaptive Cruise Control, Autonomous Emergency Braking, Lane Departure Warning, rear parking sensors (4 zone), front parking sensors (2 zone), Traffic Sign Recognition, Intelligent Speed Limit Control and more.",
    image: "/images/features/feature-safety.jpg",
    reverse: false
  },
  {
    title: "Design",
    description: "BYD SEALION 6' styling exudes sophistication and quality with futuristic and eco-conscious design elements. The 19-inch aerodynamic wheels are not only stylish, they also enhance efficiency by minimising drag.",
    image: "/images/features/feature-design.jpg",
    reverse: true
  },
  {
    title: "Super spacious",
    description: "Enjoy comfortable road trips with the whole family. BYD SEALION 6 has a 425L boot space with a large opening, so you can fit all of your most important cargo with ease. Rear passengers can enjoy comfortable amounts of space.",
    image: "/images/features/feature-space.jpg",
    reverse: false
  }
];

export default function Features() {
  return (
    <section className="py-12 md:py-24 bg-white text-black">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 font-body">A large range of standard equipment <br/> and technology for the whole family.</h2>
        </div>

        <div className="flex flex-col gap-24">
          {features.map((feature, idx) => (
            <div key={idx} className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}>
              <div className="w-full lg:w-1/2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="rounded-xl overflow-hidden aspect-[4/3]"
                >
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                </motion.div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mb-6"
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-gray-600 leading-relaxed max-w-lg font-body"
                >
                  {feature.description}
                </motion.p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
