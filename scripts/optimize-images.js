import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images');

const QUALITY_MAP = {
  '360-exterior': { quality: 85, effort: 4 },
  '360-interior': { quality: 80, effort: 6 },
  'default':      { quality: 85, effort: 4 },
};

async function convertToWebP(filePath, outputPath, quality, effort) {
  try {
    const info = await sharp(filePath)
      .webp({ quality, effort })
      .toFile(outputPath);

    const originalSize = fs.statSync(filePath).size;
    const savings = ((1 - info.size / originalSize) * 100).toFixed(1);
    return { originalSize, newSize: info.size, savings };
  } catch (err) {
    console.error(`  ✗ Failed: ${filePath} — ${err.message}`);
    return null;
  }
}

async function processDirectory(dir, depth = 0) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let totalOriginal = 0, totalNew = 0, fileCount = 0;

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

    // Skip if WebP already exists and is up to date
    if (fs.existsSync(webpPath)) {
      const origMtime = fs.statSync(fullPath).mtimeMs;
      const webpMtime = fs.statSync(webpPath).mtimeMs;
      if (webpMtime >= origMtime) continue;
    }

    const relDir = path.relative(PUBLIC_DIR, dir).split(path.sep)[0] || 'default';
    const settings = QUALITY_MAP[relDir] || QUALITY_MAP['default'];

    const result = await convertToWebP(fullPath, webpPath, settings.quality, settings.effort);
    if (result) {
      fileCount++;
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      const indent = '  '.repeat(depth + 1);
      console.log(`${indent}✓ ${entry.name}  →  .webp  (${result.savings}% smaller, ${(result.newSize/1024).toFixed(0)}KB)`);
    }
  }

  return { totalOriginal, totalNew, fileCount };
}

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  BYD Sealion 6 — Image Optimizer         ║');
  console.log('╚══════════════════════════════════════════╝\n');

  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`Image directory not found: ${PUBLIC_DIR}`);
    process.exit(1);
  }

  console.log(`Scanning: ${PUBLIC_DIR}\n`);

  const start = Date.now();
  const { totalOriginal, totalNew, fileCount } = await processDirectory(PUBLIC_DIR);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  if (fileCount === 0) {
    console.log('  All images are already optimized — nothing to do!\n');
    return;
  }

  console.log('\n' + '─'.repeat(48));
  console.log(`  Files converted : ${fileCount}`);
  console.log(`  Original total  : ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  WebP total      : ${(totalNew / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Total savings   : ${((1 - totalNew / totalOriginal) * 100).toFixed(1)}%`);
  console.log(`  Time            : ${elapsed}s`);
  console.log('─'.repeat(48));
  console.log('\n  Originals preserved. Delete them once WebP looks good.\n');
}

main();
