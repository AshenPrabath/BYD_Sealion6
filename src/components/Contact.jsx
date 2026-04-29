import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-[#f8f8f8] text-black">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* Left Column: Info */}
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight">Let's Connect.</h2>
            <div className="space-y-12">
              <ContactInfoItem 
                icon={<MapPin className="w-6 h-6" />}
                title="Experience Center"
                content="123 Innovation Drive, Tech City, AU"
                delay={0}
              />
              <ContactInfoItem 
                icon={<Phone className="w-6 h-6" />}
                title="Sales Inquiry"
                content="+61 (02) 9876 5432"
                delay={0.1}
              />
              <ContactInfoItem 
                icon={<Mail className="w-6 h-6" />}
                title="Email Support"
                content="hello@byd-experience.au"
                delay={0.2}
              />
            </div>

            <div className="mt-16 pt-16 border-t border-gray-200">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6">Follow our journey</h3>
              <div className="flex space-x-8 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                <a href="#" className="hover:text-black transition-colors">Instagram</a>
                <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-black transition-colors">Twitter (X)</a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-black/5"
          >
            <h3 className="text-2xl font-bold mb-8">Send an Inquiry</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="First Name" placeholder="John" />
                <InputGroup label="Last Name" placeholder="Doe" />
              </div>
              <InputGroup label="Email Address" placeholder="john@example.com" type="email" />
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Message</label>
                <textarea 
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 h-32 focus:ring-2 focus:ring-black outline-none transition-all resize-none font-body"
                  placeholder="I'm interested in the Sealion 6..."
                />
              </div>
              <button className="w-full py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-3 hover:bg-gray-800 transition-all">
                <span>Send Message</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function ContactInfoItem({ icon, title, content, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex space-x-6"
    >
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-black/5 text-black">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{title}</div>
        <div className="text-lg font-bold">{content}</div>
      </div>
    </motion.div>
  );
}

function InputGroup({ label, placeholder, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
      <input 
        type={type}
        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-black outline-none transition-all font-body"
        placeholder={placeholder}
      />
    </div>
  );
}
