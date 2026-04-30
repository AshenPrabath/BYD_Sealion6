import { useState, useRef, useEffect, Suspense } from 'react';
import { Maximize, Minimize, Loader2, Orbit } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ── Gyroscope camera controller (runs inside Canvas) ──
const _zee = new THREE.Vector3(0, 0, 1);
const _euler = new THREE.Euler();
const _q0 = new THREE.Quaternion();
const _q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // axis flip

function GyroControls({ orientationRef }) {
  const { camera } = useThree();
  useFrame(() => {
    const o = orientationRef.current;
    if (!o) return;
    const { alpha, beta, gamma } = o;
    if (alpha == null) return;

    const screenAngle =
      (window.screen?.orientation?.angle ?? window.orientation ?? 0) * (Math.PI / 180);

    _euler.set(
      THREE.MathUtils.degToRad(beta ?? 0),
      THREE.MathUtils.degToRad(alpha ?? 0),
      -THREE.MathUtils.degToRad(gamma ?? 0),
      'YXZ'
    );
    camera.quaternion.setFromEuler(_euler);
    camera.quaternion.multiply(_q1);
    camera.quaternion.multiply(_q0.setFromAxisAngle(_zee, -screenAngle));
  });
  return null;
}

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
    <mesh rotation={[0, -Math.PI * (80 / 180), 0]}>
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
  // Default to webp for 98% smaller file sizes
  return `/images/360-exterior/${colorId}/${prefix}${frameNum}.webp`;
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

  // --- New Batch Loading System ---
  let index = 0;
  const BATCH_SIZE = 6;

  function loadNextBatch() {
    const end = Math.min(index + BATCH_SIZE, TOTAL_FRAMES);

    for (let i = index; i < end; i++) {
      const img = new Image();
      entry.images[i] = img; // Keep order

      const handleLoaded = () => {
        entry.loadedCount++;
        onProgress(entry.loadedCount);

        // If this was the last image of the WHOLE set
        if (entry.loadedCount === TOTAL_FRAMES) {
          entry.complete = true;
          entry.loading = false;
          onComplete(entry.images);
        }
      };

      img.onload = handleLoaded;
      img.onerror = () => {
        // Fallback sequence: webp -> png -> jpg
        if (img.src.endsWith('.webp')) {
          img.src = img.src.replace('.webp', '.png');
        } else if (img.src.endsWith('.png')) {
          img.src = img.src.replace('.png', '.jpg');
        } else {
          handleLoaded();
        }
      };

      img.src = getImagePath(colorId, prefix, i);
    }

    index += BATCH_SIZE;
    if (index < TOTAL_FRAMES) {
      // Small delay before next batch to let the UI breathe
      setTimeout(loadNextBatch, 50);
    }
  }

  loadNextBatch();
}

// ── Interior URL resolver (checks jpg/png first, avoids webp for large panos) ──
async function resolveInteriorUrl(basePath) {
  for (const ext of ['webp', 'jpg', 'png']) {
    try {
      const res = await fetch(`${basePath}.${ext}`, { method: 'HEAD' });
      // Verify it's actually an image, not an HTML error page
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.startsWith('image/')) {
        return `${basePath}.${ext}`;
      }
    } catch { }
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
  const [showHint, setShowHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [gyroAvailable, setGyroAvailable] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const bgPreloadPaused = useRef(false);
  const hintTimerRef = useRef(null);
  const orientationRef = useRef(null); // live gyro data passed to GyroControls

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
  }, [loadedImages, frameIndex, isReady, view]);

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
        () => { },
        () => {
          currentIndex++;
          loadNext();
        }
      );
    }

    loadNext();
  }, [isReady, selectedColor]);

  // ── Drag handlers ──
  // ── Hint logic: show on load, re-show after 10s idle ──
  useEffect(() => {
    if (!isReady || view !== 'exterior') return;

    // Show hint after a short delay once loaded
    const showTimer = setTimeout(() => setShowHint(true), 400);

    // Hide after 1.5s
    const hideTimer = setTimeout(() => setShowHint(false), 1900);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isReady, view]);

  // Re-show hint every 10s if user hasn't interacted
  useEffect(() => {
    if (!isReady || hasInteracted || view !== 'exterior') return;

    hintTimerRef.current = setInterval(() => {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 1500);
    }, 10000);

    return () => clearInterval(hintTimerRef.current);
  }, [isReady, hasInteracted, view]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX ?? e.touches?.[0].clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const currentX = e.clientX ?? e.touches?.[0].clientX;
    const diff = currentX - startX.current;
    if (Math.abs(diff) > 10) {
      // User interacted — stop reminders
      if (!hasInteracted) {
        setHasInteracted(true);
        clearInterval(hintTimerRef.current);
      }
      setShowHint(false);
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

  // ── Gyroscope setup ──
  useEffect(() => {
    // Check if DeviceOrientationEvent is supported by the browser
    if (window.DeviceOrientationEvent || typeof DeviceOrientationEvent !== 'undefined') {
      setGyroAvailable(true);
    }
  }, []);

  const toggleGyro = async () => {
    if (gyroActive) {
      // Turn off
      window.removeEventListener('deviceorientation', handleOrientation);
      orientationRef.current = null;
      setGyroActive(false);
      return;
    }

    // iOS 13+ requires explicit permission
    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') return;
      } catch (e) {
        console.warn('Gyroscope permission denied', e);
        return;
      }
    }

    window.addEventListener('deviceorientation', handleOrientation, true);
    setGyroActive(true);
  };

  const handleOrientation = (e) => {
    orientationRef.current = {
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma,
    };
  };

  // Clean up listener on unmount or view switch
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      orientationRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (view !== 'interior' && gyroActive) {
      window.removeEventListener('deviceorientation', handleOrientation);
      orientationRef.current = null;
      setGyroActive(false);
    }
  }, [view]);

  // ── Fullscreen ──
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const el = containerRef.current;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(err => console.error(err));
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
      document.body.style.overflow = 'hidden'; // Lock scroll for iOS fallback
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error(err));
      } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
      document.body.style.overflow = 'unset';
    }
  };

  useEffect(() => {
    const handler = () => {
      const isNativeFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isNativeFullscreen);
      document.body.style.overflow = isNativeFullscreen ? 'hidden' : 'unset';
    };
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  const currentInteriorUrl = interiorUrls[interiorPosition];

  return (
    <section className="py-12 bg-[#f2f2f2] overflow-hidden relative text-black">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold">Inside and out.</h2>
      </div>

      <div className={`relative w-full mx-auto ${isFullscreen ? 'max-w-none px-0' : 'max-w-[1600px] px-6 lg:px-12'}`}>
        <div
          ref={containerRef}
          className={`w-full overflow-hidden bg-[#f2f2f2] flex items-center justify-center transition-all duration-300 ${isFullscreen
            ? 'fixed inset-0 z-[200] h-[100dvh] w-screen rounded-none bg-black'
            : 'relative aspect-[3/5] landscape:aspect-auto landscape:h-[85dvh] md:h-[80dvh] md:aspect-auto rounded-[20px] shadow-2xl'
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

              {/* Top Fill Area (Aggressive Overlap - Hidden in Landscape) */}
              <div
                className="md:hidden landscape:hidden absolute -top-[5px] left-0 w-full h-[30%] z-20 pointer-events-none"
                style={{ backgroundImage: 'url(/images/top-fill.png)', backgroundSize: 'cover', backgroundPosition: 'bottom center' }}
              />

              {/* The 360 Viewer (Middle 40%) */}
              <div className="absolute inset-0 z-10 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full select-none pointer-events-none object-contain md:object-cover scale-[2.0] landscape:scale-100 md:scale-100 z-10"
                />
              </div>

              {/* Bottom Fill Area (Aggressive Overlap - Hidden in Landscape) */}
              <div
                className="md:hidden landscape:hidden absolute -bottom-[5px] left-0 w-full h-[30%] z-20 pointer-events-none"
                style={{ backgroundImage: 'url(/images/bottom-fill.png)', backgroundSize: 'cover', backgroundPosition: 'top center' }}
              />

              {/* Animated Drag Hint Overlay */}
              <div
                className="absolute inset-0 z-[55] flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500"
                style={{ opacity: showHint ? 1 : 0 }}
              >
                <div className="flex flex-col items-center gap-3">
                  {/* Animated hand icon */}
                  <div className="relative w-14 h-14">
                    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                      {/* Hand shape */}
                      <g style={{ animation: 'swipeHint 1.2s ease-in-out infinite' }}>
                        <path d="M28 44c-7 0-14-5-14-14V20a2 2 0 0 1 4 0v6a2 2 0 0 1 4 0v-2a2 2 0 0 1 4 0v-2a2 2 0 0 1 4 0v8c2-1 4 0 4 2v2c0 5-3 10-6 10z" fill="white" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                      </g>
                      {/* Left arrow */}
                      <path d="M10 28 L4 28 M4 28 L8 24 M4 28 L8 32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ animation: 'arrowLeft 1.2s ease-in-out infinite' }}
                      />
                      {/* Right arrow */}
                      <path d="M46 28 L52 28 M52 28 L48 24 M52 28 L48 32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ animation: 'arrowRight 1.2s ease-in-out infinite' }}
                      />
                    </svg>
                  </div>
                  <span className="bg-black/60 backdrop-blur-md text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Drag to rotate
                  </span>
                </div>
              </div>

              {/* Bottom Center: Color buttons + model/color label */}
              <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center space-y-2 md:space-y-3">
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
                {/* Model + Color label below swatches */}
                <div className="flex flex-col items-center pointer-events-none text-center">
                  <span className="text-black/40 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">BYD Sealion 6</span>
                  <span className="text-black text-sm md:text-xl font-bold uppercase tracking-tight whitespace-nowrap">{selectedColorData.name}</span>
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
                  camera={{ position: [0, 0, 0.1], fov: 90 }}
                  gl={{
                    toneMapping: THREE.NoToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace
                  }}
                >
                  {gyroActive
                    ? <GyroControls orientationRef={orientationRef} />
                    : <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.5} />
                  }
                  <Suspense fallback={null}>
                    <InteriorSphere
                      url={currentInteriorUrl}
                      offsetX={interiorPosition === 'driver' ? 0.5 : 0}
                    />
                  </Suspense>
                </Canvas>
              )}

              {/* Gyro toggle button — top-left inside viewer */}
              <button
                onClick={toggleGyro}
                title={gyroActive ? 'Switch to drag control' : 'Enable gyroscope'}
                className={`absolute top-4 left-4 z-50 p-2 rounded-full border backdrop-blur-md shadow-lg transition-all ${gyroActive
                  ? 'bg-black text-white border-black'
                  : 'bg-white/40 text-black border-white/20 hover:bg-white/60'
                  }`}
              >
                <Orbit className={`w-4 h-4 md:w-5 md:h-5 transition-all ${gyroActive ? 'text-white animate-pulse rotate-12' : 'text-black'
                  }`} />
              </button>

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

              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
