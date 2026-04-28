import { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// --- Interior 360 Component ---
// rotateSpeed is negative to correct the flip (mirroring) of equirectangular panoramas
function InteriorSphere({ url, offsetX = 0 }) {
  const texture = useTexture(url);
  
  // Set color space to sRGB to match the original image profile
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;     // flip horizontally to fix mirrored panorama
  texture.offset.x = offsetX; // shift starting angle (0.5 = 180°)
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

const colors = [
  { id: 'white', name: 'Arctic White', prefix: 'W_', colorClass: 'bg-[#f4f4f4] border border-gray-300' },
  { id: 'stone-grey', name: 'Stone Grey', prefix: 'S_', colorClass: 'bg-[#7a7a7a]' },
  { id: 'harbour-grey', name: 'Harbour Grey', prefix: 'H_', colorClass: 'bg-[#4a4a4a]' },
  { id: 'cosmos-black', name: 'Cosmos Black', prefix: 'B_', colorClass: 'bg-[#1a1a1a]' },
];

const interiorPositions = [
  { id: 'middle', name: 'Middle' },
  { id: 'driver', name: 'Driver' },
];

async function resolveUrl(basePath) {
  for (const ext of ['jpg', 'png']) {
    try {
      const res = await fetch(`${basePath}.${ext}`, { method: 'HEAD' });
      if (res.ok) return `${basePath}.${ext}`;
    } catch {}
  }
  return null;
}

export default function Car360Viewer() {
  const [view, setView] = useState('exterior');
  const [selectedColor, setSelectedColor] = useState('white');
  const [interiorPosition, setInteriorPosition] = useState('middle');
  const [interiorUrls, setInteriorUrls] = useState({ middle: null, driver: null });
  const [frameIndex, setFrameIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const containerRef = useRef(null);

  const totalFrames = 48;
  const selectedColorData = colors.find(c => c.id === selectedColor) || colors[0];

  const exteriorImages = Array.from(
    { length: totalFrames },
    (_, i) => {
      const frameNum = (i + 1).toString().padStart(4, '0');
      const prefix = selectedColorData.prefix || '';
      return `/images/360-exterior/${selectedColor}/${prefix}${frameNum}.png`;
    }
  );

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX ?? e.touches?.[0].clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const currentX = e.clientX ?? e.touches?.[0].clientX;
    const diff = currentX - startX.current;
    if (Math.abs(diff) > 10) {
      setFrameIndex((prev) =>
        diff > 0 ? (prev - 1 + totalFrames) % totalFrames : (prev + 1) % totalFrames
      );
      startX.current = currentX;
    }
  };

  const handleMouseUp = () => { isDragging.current = false; };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const [middle, driver] = await Promise.all([
        resolveUrl('/images/360-interior/middle'),
        resolveUrl('/images/360-interior/driver'),
      ]);
      // Fallback: if only one file exists (the old "interior.jpg"), use it for both
      const fallback = middle || driver || (await resolveUrl('/images/360-interior/interior'));
      setInteriorUrls({
        middle: middle || fallback,
        driver: driver || fallback,
      });
    })();
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const currentInteriorUrl = interiorUrls[interiorPosition];

  return (
    <section className="py-12 bg-gray-50 overflow-hidden relative text-black">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold">Inside and out.</h2>
      </div>

      <div className={`relative w-full mx-auto ${isFullscreen ? 'max-w-none px-0' : 'max-w-[1600px] px-6 lg:px-12'}`}>
        <div 
          ref={containerRef}
          className={`relative w-full overflow-hidden bg-white flex items-center justify-center ${
            isFullscreen 
              ? 'h-screen w-screen rounded-none bg-black' 
              : 'aspect-square md:h-[80vh] md:aspect-auto rounded-[20px] shadow-2xl'
          }`}
        >
          {/* Fullscreen Toggle */}
          <button 
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 p-2 bg-white/40 backdrop-blur-md rounded-full border border-white/20 text-black hover:bg-white/60 transition-colors shadow-lg"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 md:w-5 md:h-5" /> : <Maximize className="w-4 h-4 md:w-5 md:h-5" />}
          </button>

          {/* Top Center: Exterior / Interior Toggle */}
          <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-30">
            <div className="inline-flex bg-white/40 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-lg">
              <button
                onClick={() => setView('exterior')}
                className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${view === 'exterior' ? 'bg-black text-white' : 'text-black hover:text-gray-600'}`}
              >
                EXTERIOR
              </button>
              <button
                onClick={() => setView('interior')}
                className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${view === 'interior' ? 'bg-black text-white' : 'text-black hover:text-gray-600'}`}
              >
                INTERIOR
              </button>
            </div>
          </div>

          {/* ── EXTERIOR VIEW ── */}
          {view === 'exterior' && (
            <div
              className="w-full h-full cursor-grab active:cursor-grabbing relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
            >
              {exteriorImages.map((src, index) => (
                <img
                  key={`${selectedColor}-${index}`}
                  src={src}
                  alt={`Car exterior view ${index}`}
                  className={`absolute inset-0 w-full h-full select-none pointer-events-none transition-opacity duration-0 ${
                    isFullscreen ? 'object-contain' : 'object-cover'
                  } ${index === frameIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  draggable="false"
                  onError={(e) => {
                    if (e.target.src.endsWith('.png'))
                      e.target.src = e.target.src.replace('.png', '.jpg');
                  }}
                />
              ))}

              {/* Bottom Left: Selected Color Text */}
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-10 z-30 pointer-events-none">
                <div className="flex flex-col">
                  <span className="text-black/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1">BYD Sealion 6</span>
                  <span className="text-black text-lg md:text-2xl font-bold uppercase tracking-tight">{selectedColorData.name}</span>
                </div>
              </div>

              <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-3 md:space-y-4">
                {/* Color Buttons */}
                <div className="flex space-x-2 md:space-x-3">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => { setSelectedColor(color.id); }}
                      title={color.name}
                      className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all ${color.colorClass} ${selectedColor === color.id ? 'border-black scale-125 shadow-md' : 'border-transparent hover:scale-110'}`}
                    />
                  ))}
                </div>
                {/* Drag hint */}
                <div className="bg-black/60 backdrop-blur-md text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1 md:space-x-2">
                  <ChevronLeft className="w-3 h-3" />
                  <span>Drag to rotate</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          )}

          {/* ── INTERIOR VIEW ── */}
          {view === 'interior' && (
            <div className="w-full h-full cursor-grab active:cursor-grabbing relative">
              <Canvas 
                camera={{ position: [0, 0, 0.1] }}
                gl={{ 
                  toneMapping: THREE.NoToneMapping,
                  outputColorSpace: THREE.SRGBColorSpace 
                }}
              >
                <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.5} />
                <Suspense fallback={null}>
                  {currentInteriorUrl && (
                    <InteriorSphere
                      url={currentInteriorUrl}
                      offsetX={interiorPosition === 'driver' ? 0.5 : 0}
                    />
                  )}
                </Suspense>
              </Canvas>

              <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-3 md:space-y-4 pointer-events-auto">
                {/* Position Selector */}
                <div className="flex bg-white/30 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-lg space-x-1">
                  {interiorPositions.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setInteriorPosition(pos.id)}
                      className={`px-3 py-1.5 md:px-5 md:py-2 rounded-full text-[9px] md:text-[11px] font-bold transition-all ${interiorPosition === pos.id ? 'bg-black text-white' : 'text-black hover:text-gray-600'}`}
                    >
                      {pos.name}
                    </button>
                  ))}
                </div>
                {/* Drag hint */}
                <div className="pointer-events-none bg-black/60 backdrop-blur-md text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
                  Drag to look around
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
