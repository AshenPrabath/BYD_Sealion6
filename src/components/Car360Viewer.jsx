import { useState, useRef, useEffect, Suspense } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Loader2 } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// --- Interior 360 Component ---
function InteriorSphere({ url, offsetX = 0 }) {
  const texture = useTexture(url);
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;
  texture.offset.x = offsetX;
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// ── Configuration ──
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

const TOTAL_FRAMES = 48;

// ══════════════════════════════════════════
// ══  GLOBAL IMAGE CACHE
// ══════════════════════════════════════════
const globalImageCache = {};

function getImagePath(colorId, prefix, frameIndex) {
  const frameNum = (frameIndex + 1).toString().padStart(4, '0');
  return `/images/360-exterior/${colorId}/${prefix}${frameNum}.png`;
}

function loadColorImages(colorId, prefix, onProgress, onComplete) {
  if (globalImageCache[colorId]?.complete) {
    onProgress(TOTAL_FRAMES);
    onComplete(globalImageCache[colorId].images);
    return;
  }

  if (globalImageCache[colorId]?.loading) {
    const existing = globalImageCache[colorId];
    const checkInterval = setInterval(() => {
      onProgress(existing.loadedCount);
      if (existing.complete) {
        clearInterval(checkInterval);
        onComplete(existing.images);
      }
    }, 100);
    return;
  }

  const entry = {
    images: [],
    loadedCount: 0,
    complete: false,
    loading: true,
  };
  globalImageCache[colorId] = entry;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    entry.images.push(img);

    const handleLoaded = () => {
      entry.loadedCount++;
      onProgress(entry.loadedCount);
      if (entry.loadedCount === TOTAL_FRAMES) {
        entry.complete = true;
        entry.loading = false;
        onComplete(entry.images);
      }
    };

    img.onload = handleLoaded;
    img.onerror = () => {
      if (img.src.endsWith('.png')) {
        img.src = img.src.replace('.png', '.webp');
      } else if (img.src.endsWith('.webp')) {
        img.src = img.src.replace('.webp', '.jpg');
      } else {
        handleLoaded();
      }
    };

    img.src = getImagePath(colorId, prefix, i);
  }
}

// ── Interior URL resolver (checks jpg/png first, avoids webp for large panos) ──
async function resolveInteriorUrl(basePath) {
  for (const ext of ['jpg', 'png', 'webp']) {
    try {
      const res = await fetch(`${basePath}.${ext}`, { method: 'HEAD' });
      // Verify it's actually an image, not an HTML error page
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.startsWith('image/')) {
        return `${basePath}.${ext}`;
      }
    } catch {}
  }
  return null;
}

// ── Interior image preloader (regular Image() to validate before passing to Three.js) ──
const interiorImageCache = {};

function preloadInteriorImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) return reject('No URL');
    if (interiorImageCache[url]) return resolve(url);

    const img = new Image();
    img.onload = () => {
      interiorImageCache[url] = true;
      resolve(url);
    };
    img.onerror = () => reject(`Failed to load: ${url}`);
    img.src = url;
  });
}

// ══════════════════════════════════════
// ══  MAIN COMPONENT  ════════════════
// ══════════════════════════════════════
export default function Car360Viewer() {
  const [view, setView] = useState('exterior');
  const [selectedColor, setSelectedColor] = useState('white');
  const [interiorPosition, setInteriorPosition] = useState('middle');
  const [interiorUrls, setInteriorUrls] = useState({ middle: null, driver: null });
  const [frameIndex, setFrameIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [interiorReady, setInteriorReady] = useState(false);
  const [interiorLoadProgress, setInteriorLoadProgress] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const bgPreloadPaused = useRef(false);

  const selectedColorData = colors.find(c => c.id === selectedColor) || colors[0];

  // ── Load images for the currently selected color ──
  useEffect(() => {
    // If already fully cached, use instantly — no loading screen
    if (globalImageCache[selectedColor]?.complete) {
      setLoadedImages(globalImageCache[selectedColor].images);
      setLoadProgress(100);
      setIsReady(true);
      return;
    }

    // Not cached yet — show loading overlay
    setIsReady(false);
    setLoadProgress(0);

    loadColorImages(
      selectedColor,
      selectedColorData.prefix,
      (count) => setLoadProgress(Math.round((count / TOTAL_FRAMES) * 100)),
      (images) => {
        setLoadedImages(images);
        setIsReady(true);
      }
    );
  }, [selectedColor, selectedColorData.prefix]);

  // ── Paint the canvas whenever frame changes OR images become ready ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isReady || !loadedImages[frameIndex]) return;

    const ctx = canvas.getContext('2d');
    const img = loadedImages[frameIndex];

    if (!img.complete || !img.naturalWidth) return;

    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, [loadedImages, frameIndex, isReady]);

  // ── Resolve interior URLs on mount ──
  useEffect(() => {
    (async () => {
      const [middle, driver] = await Promise.all([
        resolveInteriorUrl('/images/360-interior/middle'),
        resolveInteriorUrl('/images/360-interior/driver'),
      ]);
      const fallback = middle || driver || (await resolveInteriorUrl('/images/360-interior/interior'));
      setInteriorUrls({
        middle: middle || fallback,
        driver: driver || fallback,
      });
    })();
  }, []);

  // ── When switching to interior: pause bg preload, preload the pano, then resume ──
  useEffect(() => {
    if (view !== 'interior') {
      bgPreloadPaused.current = false;
      return;
    }

    // Pause background exterior loading
    bgPreloadPaused.current = true;
    setInteriorReady(false);
    setInteriorLoadProgress(0);

    const currentUrl = interiorUrls[interiorPosition];
    if (!currentUrl) return;

    // If already cached, instant
    if (interiorImageCache[currentUrl]) {
      setInteriorReady(true);
      setInteriorLoadProgress(100);
      // Resume bg preload after a short delay
      setTimeout(() => { bgPreloadPaused.current = false; }, 500);
      return;
    }

    // Simulate progress while loading (the pano is a single large file)
    let fakeProgress = 0;
    const progressInterval = setInterval(() => {
      fakeProgress = Math.min(fakeProgress + Math.random() * 15, 90);
      setInteriorLoadProgress(Math.round(fakeProgress));
    }, 200);

    preloadInteriorImage(currentUrl)
      .then(() => {
        clearInterval(progressInterval);
        setInteriorLoadProgress(100);
        setInteriorReady(true);
        // Resume bg preload after interior is ready
        setTimeout(() => { bgPreloadPaused.current = false; }, 500);
      })
      .catch(() => {
        clearInterval(progressInterval);
        // Still show canvas, drei will handle its own loading
        setInteriorReady(true);
        setTimeout(() => { bgPreloadPaused.current = false; }, 500);
      });

    return () => clearInterval(progressInterval);
  }, [view, interiorPosition, interiorUrls]);

  // ── Background preload: after selected color is ready, preload all others ──
  useEffect(() => {
    if (!isReady) return;

    const remaining = colors.filter(
      c => c.id !== selectedColor && !globalImageCache[c.id]?.complete && !globalImageCache[c.id]?.loading
    );

    if (remaining.length === 0) return;

    let currentIndex = 0;

    function loadNext() {
      if (currentIndex >= remaining.length) return;

      // Check if paused (user switched to interior)
      if (bgPreloadPaused.current) {
        // Retry after a delay
        setTimeout(loadNext, 1000);
        return;
      }

      const color = remaining[currentIndex];

      loadColorImages(
        color.id,
        color.prefix,
        () => {},
        () => {
          currentIndex++;
          loadNext();
        }
      );
    }

    loadNext();
  }, [isReady, selectedColor]);

  // ── Drag handlers ──
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
        diff > 0 ? (prev - 1 + TOTAL_FRAMES) % TOTAL_FRAMES : (prev + 1) % TOTAL_FRAMES
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

  // ── Fullscreen ──
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
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
              {/* Loading Overlay — only covers the canvas, not the controls */}
              {!isReady && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-black/40 mb-4" />
                  <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${loadProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-3">
                    Loading {selectedColorData.name} — {loadProgress}%
                  </span>
                </div>
              )}

              {/* Single <canvas> — renders only the active frame */}
              <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full select-none pointer-events-none ${
                  isFullscreen ? 'object-contain' : 'object-cover'
                }`}
              />

              {/* Bottom Left: Selected Color Text — always above overlay */}
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-10 z-[60] pointer-events-none">
                <div className="flex flex-col">
                  <span className="text-black/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1">BYD Sealion 6</span>
                  <span className="text-black text-lg md:text-2xl font-bold uppercase tracking-tight">{selectedColorData.name}</span>
                </div>
              </div>

              {/* Bottom Center: Color buttons + drag hint — always above overlay */}
              <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center space-y-3 md:space-y-4">
                {/* Color Buttons */}
                <div className="flex space-x-2 md:space-x-3">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
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

              {/* Interior Loading Overlay */}
              {!interiorReady && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-black/40 mb-4" />
                  <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${interiorLoadProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-3">
                    Loading Interior — {interiorLoadProgress}%
                  </span>
                </div>
              )}

              {/* Only mount the 3D canvas after image is preloaded */}
              {interiorReady && currentInteriorUrl && (
                <Canvas 
                  camera={{ position: [0, 0, 0.1] }}
                  gl={{ 
                    toneMapping: THREE.NoToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace 
                  }}
                >
                  <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.5} />
                  <Suspense fallback={null}>
                    <InteriorSphere
                      url={currentInteriorUrl}
                      offsetX={interiorPosition === 'driver' ? 0.5 : 0}
                    />
                  </Suspense>
                </Canvas>
              )}

              <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center space-y-3 md:space-y-4 pointer-events-auto">
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
