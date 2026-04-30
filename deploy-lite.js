import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Starting Lite Viewer deployment...');

const distPath = path.resolve('dist-viewer');
const vercelConfigPath = path.resolve('.vercel-lite');

// 1. Build the Lite Viewer
console.log('📦 Building project...');
execSync('npm run build:lite', { stdio: 'inherit' });

// 2. Restore Vercel Memory
console.log('🔗 Restoring Vercel project links...');
if (fs.existsSync(vercelConfigPath)) {
  fs.cpSync(vercelConfigPath, path.join(distPath, '.vercel'), { recursive: true });
} else {
  console.error('❌ Could not find .vercel-lite folder. You may need to link manually once.');
}

// 3. Deploy
console.log('☁️ Deploying to Vercel...');
try {
  execSync('npx vercel --prod --yes', { cwd: distPath, stdio: 'inherit' });
  console.log('✅ Lite Viewer deployed successfully!');
} catch (error) {
  console.error('❌ Deployment failed');
  process.exit(1);
}
