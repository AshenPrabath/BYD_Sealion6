import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const DIRECTORIES_TO_SCAN = [
  'public/images/360-exterior',
  // You can add more directories here if needed
];

async function convertPngToWebp(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      await convertPngToWebp(fullPath);
    } else if (item.toLowerCase().endsWith('.png')) {
      const webpPath = fullPath.replace(/\.png$/i, '.webp');
      
      console.log(`Converting: ${item} -> ${path.basename(webpPath)}`);
      
      try {
        // Convert to WebP with aggressive optimization
        await sharp(fullPath)
          .webp({ 
            quality: 75, // Adjust this between 0-100 for balance of quality/size
            effort: 6    // Maximum compression effort
          })
          .toFile(webpPath);
          
        // Delete the original PNG after successful conversion
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.error(`Failed to convert ${fullPath}:`, err);
      }
    }
  }
}

async function start() {
  console.log('🚗 Starting WebP conversion...');
  for (const dir of DIRECTORIES_TO_SCAN) {
    if (fs.existsSync(dir)) {
      await convertPngToWebp(dir);
    }
  }
  console.log('✅ Conversion complete! All PNGs have been deleted and replaced with WebP.');
}

start();
