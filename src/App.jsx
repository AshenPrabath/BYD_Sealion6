import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Car360Viewer from './components/Car360Viewer';
import InteriorFeatures from './components/InteriorFeatures';
import Specs from './components/Specs';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white text-black overflow-x-hidden w-full relative">
      <Navbar />
      <Hero />
      <div className="bg-gray-50 py-12">
        <Car360Viewer />
      </div>
      <Features />
      <InteriorFeatures />
      <Specs />
      <Footer />
    </div>
  );
}

export default App;
