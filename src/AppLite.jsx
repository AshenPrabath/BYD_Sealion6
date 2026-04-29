import React from 'react';
import Car360ViewerLite from './components/Car360ViewerLite';

function AppLite() {
  return (
    <main className="min-h-screen w-full bg-white">
      {/* Full-width, full-height immersive viewer */}
      <Car360ViewerLite />
    </main>
  );
}

export default AppLite;
