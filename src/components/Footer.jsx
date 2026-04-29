import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-32 pb-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-24">
          
          <div className="lg:col-span-2">
            <img src="/images/byd-logo.png" alt="BYD" className="h-[40px] w-auto brightness-0 invert mb-8" />
            <p className="font-body text-gray-500 max-w-sm mb-8 text-lg">
              Building Dreams for a sustainable future. Leading the world in New Energy Vehicles.
            </p>
            <div className="flex space-x-6">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                <span className="text-[10px] font-bold uppercase tracking-widest">In</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                <span className="text-[10px] font-bold uppercase tracking-widest">Ig</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                <span className="text-[10px] font-bold uppercase tracking-widest">X</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-white">Vehicles</h4>
            <ul className="space-y-4 text-gray-500 font-body">
              <li><a href="#" className="hover:text-white transition-colors">Sealion 6</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SEAL</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ATTO 3</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DOLPHIN</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-white">Experience</h4>
            <ul className="space-y-4 text-gray-500 font-body">
              <li><a href="#" className="hover:text-white transition-colors">Find a Showroom</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Book a Test Drive</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DM-i Technology</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Charging</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 text-white">Company</h4>
            <ul className="space-y-4 text-gray-500 font-body">
              <li><a href="#" className="hover:text-white transition-colors">About BYD</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">News & Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
          <div className="mb-4 md:mb-0">
            BYD © 2026. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-12">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
