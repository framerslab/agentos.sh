// One-shot: re-encode the 676KB forge poster PNG to WebP for the <video poster>.
// The PNG stays for OG/Twitter meta (those scrapers want PNG/JPEG). The poster
// is fetched on initial load of the homepage's forge demo, so its byte weight
// is on the critical path for LCP — WebP cuts it ~85%.
import sharp from 'sharp';

const SRC = 'public/img/blog/og/agentos-emergent-demo.png';
const OUT = 'public/img/blog/og/agentos-emergent-demo.webp';

// The source PNG is 3200x2900 but the <video poster> renders in a 1600x920
// box. Encoding at source resolution wasted ~140KB; resizing to 1600w covers
// the display box at 1x and typical 2x DPR while landing ~91KB at q62.
const info = await sharp(SRC)
  .resize({ width: 1600 })
  .webp({ quality: 62, effort: 6 })
  .toFile(OUT);
console.log(`wrote ${OUT}: ${(info.size / 1024).toFixed(0)} KB`);
