import { motion } from 'framer-motion';

const specs = [
  {
    name: "Essential",
    accel: "8.5 s",
    power: "160 kW",
    drivetrain: "FWD",
    engine: "1.5L plug-in hybrid engine",
    consumption: "1.1 L/100km",
    electricRange: "92km",
    fuelTank: "60L",
    terrain: "Snow",
    trunk: "1,440L"
  },
  {
    name: "Dynamic Extended",
    accel: "8.9 s",
    power: "160 kW",
    drivetrain: "FWD",
    engine: "1.5L plug-in hybrid engine",
    consumption: "0.8 L/100km",
    electricRange: "140km",
    fuelTank: "60L",
    terrain: "Snow",
    trunk: "1,440L"
  },
  {
    name: "Premium Extended",
    accel: "5.5 s",
    power: "253 kW",
    drivetrain: "AWD",
    engine: "1.5L turbo plug-in hybrid engine",
    consumption: "1.1 L/100km",
    electricRange: "128km",
    fuelTank: "60L",
    terrain: "Mud, Sand, Snow",
    trunk: "1,440L"
  }
];

export default function Specs() {
  return (
    <section className="py-24 bg-gray-50 text-black">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-4">BYD SEALION 6 Specifications</h2>
          <p className="text-lg text-gray-600">Compare the variants to find the perfect fit for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specs.map((spec, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold mb-8 border-b pb-4">{spec.name}</h3>
              
              <div className="space-y-6">
                <SpecRow label="Acceleration 0-100km/h" value={spec.accel} />
                <SpecRow label="Maximum power" value={spec.power} />
                <SpecRow label="Drivetrain" value={spec.drivetrain} />
                <SpecRow label="Engine" value={spec.engine} />
                <SpecRow label="Fuel consumption" value={spec.consumption} />
                <SpecRow label="Electric range" value={spec.electricRange} />
                <SpecRow label="Fuel tank" value={spec.fuelTank} />
                <SpecRow label="Driving terrain mode" value={spec.terrain} />
                <SpecRow label="Max trunk capacity" value={spec.trunk} />
              </div>

              <button className="mt-10 w-full py-4 border border-black rounded-full font-semibold hover:bg-black hover:text-white transition-colors">
                Build & Price
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 mb-1">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
