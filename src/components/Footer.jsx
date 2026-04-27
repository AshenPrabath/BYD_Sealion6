import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          <div>
            <h4 className="text-xl font-bold mb-6">Newsletter</h4>
            <p className="text-white/60 mb-6">Stay up to date with the latest from BYD</p>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-white/10 px-4 py-3 outline-none focus:bg-white/20 w-full" />
              <button className="bg-white text-black px-6 font-bold hover:bg-gray-200">Subscribe</button>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Shop</h4>
            <ul className="space-y-3 text-white/60">
              <li><a href="#" className="hover:text-white">ATTO 3</a></li>
              <li><a href="#" className="hover:text-white">DOLPHIN</a></li>
              <li><a href="#" className="hover:text-white">SEAL</a></li>
              <li><a href="#" className="hover:text-white">SEALION 6</a></li>
              <li><a href="#" className="hover:text-white">SHARK 6</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Explore</h4>
            <ul className="space-y-3 text-white/60">
              <li><a href="#" className="hover:text-white">Find Us</a></li>
              <li><a href="#" className="hover:text-white">Test Drive</a></li>
              <li><a href="#" className="hover:text-white">Offers</a></li>
              <li><a href="#" className="hover:text-white">Home Charging</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">About</h4>
            <ul className="space-y-3 text-white/60">
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Service & Warranty</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
          <div className="mb-4 md:mb-0">
            BYD Australia Pty Ltd © 2026
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
