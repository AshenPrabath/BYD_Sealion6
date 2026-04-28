/**
 * BYD Sealion 6 — Image Optimization Script
 * 
 * Converts all PNG/JPG images in the public/images directory to WebP format.
 * This can reduce file sizes by 60-80% with no visible quality loss.
 * 
 * Usage:
 *   npm install sharp    (one-time)
 *   node scripts/optimize-images.js
 * 
 * The script will:
 *   1. Convert all exterior PNGs → WebP (quality 85)
 *   2. Convert interior panorama JPGs → WebP (quality 80)
 *   3. Convert static feature/gallery images → WebP (quality 85)
 *   4. Keep originals intact (creates .webp alongside .png/.jpg)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images');

// Settings per folder type
const QUALITY_MAP = {
  '360-exterior': { quality: 85, effort: 4 },   // Good balance for 192 images
  '360-interior': { quality: 80, effort: 6 },   // Slightly lower for huge panos
  'default':      { quality: 85, effort: 4 },   // Everything else
};

async function convertToWebP(filePath, outputPath, quality, effort) {
  try {
    const info = await sharp(filePath)
      .webp({ quality, effort })
      .toFile(outputPath);

    const originalSize = fs.statSync(filePath).size;
    const newSize = info.size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    return { originalSize, newSize, savings };
  } catch (err) {
    console.error(`  ✗ Failed: ${filePath} — ${err.message}`);
    return null;
  }
}

async function processDirectory(dir, depth = 0) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let totalOriginal = 0;
  let totalNew = 0;
  let fileCount = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const sub = await processDirectory(fullPath, depth + 1);
      totalOriginal += sub.totalOriginal;
      totalNew += sub.totalNew;
      fileCount += sub.fileCount;
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const webpPath = fullPath.replace(/\.(png|jpe?g)$/i, '.webp');

    // Skip if WebP already exists and is newer
    if (fs.existsSync(webpPath)) {
      const origMtime = fs.statSync(fullPath).mtimeMs;
      const webpMtime = fs.statSync(webpPath).mtimeMs;
      if (webpMtime >= origMtime) continue;
    }

    // Determine quality based on parent folder
    const relDir = path.relative(PUBLIC_DIR, dir).split(path.sep)[0] || 'default';
    const settings = QUALITY_MAP[relDir] || QUALITY_MAP['default'];

    const result = await convertToWebP(fullPath, webpPath, settings.quality, settings.effort);
    if (result) {
      fileCount++;
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      const indent = '  '.repeat(depth + 1);
      console.log(`${indent}✓ ${entry.name} → .webp  (${result.savings}% smaller)`);
    }
  }

  return { totalOriginal, totalNew, fileCount };
}

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  BYD Sealion 6 — Image Optimizer         ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log();

  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`Image directory not found: ${PUBLIC_DIR}`);
    process.exit(1);
  }

  console.log(`Scanning: ${PUBLIC_DIR}\n`);

  const start = Date.now();
  const { totalOriginal, totalNew, fileCount } = await processDirectory(PUBLIC_DIR);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log();
  console.log('─'.repeat(44));
  console.log(`  Files converted: ${fileCount}`);
  console.log(`  Original total:  ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  WebP total:      ${(totalNew / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Savings:         ${((1 - totalNew / totalOriginal) * 100).toFixed(1)}%`);
  console.log(`  Time:            ${elapsed}s`);
  console.log('─'.repeat(44));
  console.log();
  console.log('  Originals are preserved. You can delete them');
  console.log('  once you confirm WebP versions look correct.');
  console.log();
}

main();
