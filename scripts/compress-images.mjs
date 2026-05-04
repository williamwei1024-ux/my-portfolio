/**
 * Image Compressor Script
 * Compresses all images in src/assets/ to under 5MB
 * Usage: node scripts/compress-images.mjs
 *        node scripts/compress-images.mjs --single <file-path>
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 3500;
const QUALITY = 80;

const ASSETS_DIR = './src/assets';

// Check for --single flag
const singleArg = process.argv.find(arg => arg.startsWith('--single='));

function getImageFiles(dir) {
  const images = [];
  const exts = ['.jpg', '.jpeg', '.png', '.webp'];

  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (exts.includes(path.extname(file).toLowerCase())) {
        images.push(fullPath);
      }
    }
  }

  walk(dir);
  return images;
}

async function compressImage(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size <= MAX_SIZE) {
    console.log(`  ✓ ${path.basename(filePath)} (${(stat.size / 1024 / 1024).toFixed(2)}MB - already small)`);
    return true;
  }

  const ext = path.extname(filePath).toLowerCase();
  const outputExt = ext === '.png' ? '.png' : '.jpeg';
  const tempPath = filePath.replace(ext, outputExt);

  let pipeline = sharp(filePath)
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true });

  if (outputExt === '.png') {
    pipeline = pipeline.png({ quality: QUALITY, effort: 9 });
  } else {
    pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
  }

  await pipeline.toFile(tempPath);

  const newStat = fs.statSync(tempPath);
  const newSizeMB = (newStat.size / 1024 / 1024).toFixed(2);

  if (newStat.size < stat.size) {
    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
    console.log(`  ✓ ${path.basename(filePath)}: ${(stat.size / 1024 / 1024).toFixed(2)}MB → ${newSizeMB}MB`);
    return true;
  } else {
    fs.unlinkSync(tempPath);
    console.log(`  ✗ ${path.basename(filePath)} - could not compress smaller`);
    return false;
  }
}

async function main() {
  const singleFile = singleArg?.replace('--single=', '');

  if (singleFile) {
    // Single file mode for pre-commit hook
    if (!fs.existsSync(singleFile)) {
      console.error(`File not found: ${singleFile}`);
      process.exit(1);
    }
    console.log(`\n🖼️  Compressing: ${singleFile}\n`);
    await compressImage(singleFile);
    return;
  }

  // Normal mode: compress all images in src/assets
  console.log('\n🖼️  Compressing images in src/assets/ to under 5MB...\n');

  const images = getImageFiles(ASSETS_DIR);
  console.log(`Found ${images.length} images\n`);

  let compressed = 0;
  for (const img of images) {
    const stat = fs.statSync(img);
    if (stat.size > MAX_SIZE) {
      await compressImage(img);
      compressed++;
    } else {
      console.log(`  ✓ ${path.basename(img)} (${(stat.size / 1024 / 1024).toFixed(2)}MB - already small)`);
    }
  }

  console.log(`\n✅ Done! ${compressed} images compressed.\n`);
}

main().catch(console.error);