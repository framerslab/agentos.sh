import { promises as fs } from 'node:fs';
import path from 'node:path';

const locales = ['en', 'zh', 'ko', 'ja', 'es', 'de', 'fr', 'pt'];
const outDir = path.resolve(process.cwd(), 'out');

// Default-locale top-level page directories are auto-discovered from the
// export output (out/en/<page>/) and copied to out/<page>/ so the bare-path
// URL serves the real English content directly. Cloudflare 301s
// /en/<page>/ → /<page>/ so the /en/ form collapses into the canonical bare
// path. See lib/seo/canonical.ts for the canonical strategy. Reading the set
// from disk means a new page is mirrored automatically and never has to be
// registered here by hand.
async function discoverLocalizedPages() {
  const enDir = path.join(outDir, 'en');
  try {
    const entries = await fs.readdir(enDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    console.warn(`[post-export] Could not read ${enDir} to discover pages:`, error.message);
    return [];
  }
}

async function copyIfExists(src, dest) {
  try {
    await fs.copyFile(src, dest);
    return true;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`[post-export] Failed to copy ${src} → ${dest}:`, error.message);
    }
    return false;
  }
}

async function copyRecursive(src, dest) {
  // Node 16+ supports fs.cp; use it when available, fall back to manual walk.
  if (typeof fs.cp === 'function') {
    await fs.cp(src, dest, { recursive: true, force: true });
    return;
  }
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    await Promise.all(
      entries.map((entry) =>
        copyRecursive(path.join(src, entry.name), path.join(dest, entry.name))
      )
    );
  } else if (stat.isFile()) {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
  }
}

// Next.js 14.2.x + `output: 'export'` + `next/font/google` emits a stray
// `<script src="/_next/static/css/<hash>.css" async></script>` next to the
// legitimate `<link rel="stylesheet">` for the font CSS chunk. The browser
// tries to parse the CSS as JS and throws "SyntaxError: Invalid or unexpected
// token" on every page load. The page renders fine but the error sits in
// every visitor's console and docks the Lighthouse Best Practices score.
function stripCssAsScriptTags(html) {
  return html.replace(
    /<script\s+src="\/_next\/static\/css\/[^"]+\.css"[^>]*><\/script>/g,
    ''
  );
}

async function walkHtmlFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return out;
    throw error;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkHtmlFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

async function run() {
  // Serve the English homepage HTML directly at `/` instead of the
  // 64-byte meta-refresh stub from `public/index.html`. The stub
  // imposes a ~750ms PageSpeed penalty (`redirects` opportunity).
  // We overwrite `out/index.html` (which Next.js copied from
  // `public/index.html`) with the rendered `out/en/index.html`.
  try {
    const enHtmlSrc = path.join(outDir, 'en', 'index.html');
    const rootHtmlDest = path.join(outDir, 'index.html');
    await fs.copyFile(enHtmlSrc, rootHtmlDest);
    console.log('[post-export] Replaced root index.html with /en/ homepage');
  } catch (error) {
    console.warn('[post-export] Failed to overwrite root index.html:', error.message);
  }

  // Copy locale index files
  await Promise.all(
    locales.map(async (locale) => {
      const htmlSrc = path.join(outDir, locale, 'index.html');
      const htmlDest = path.join(outDir, `${locale}.html`);
      const txtSrc = path.join(outDir, locale, 'index.txt');
      const txtDest = path.join(outDir, `${locale}.txt`);

      const htmlCopied = await copyIfExists(htmlSrc, htmlDest);
      const txtCopied = await copyIfExists(txtSrc, txtDest);

      if (htmlCopied || txtCopied) {
        console.log(`[post-export] Ensured flat copies for /${locale}`);
      }
    })
  );

  // Mirror the English page trees to bare paths so /<page>/ serves real
  // content (matching the canonical URL emitted by lib/seo/canonical.ts).
  // Earlier revisions wrote a meta-refresh stub at /<page>/ pointing to
  // /en/<page>/; that was correct when the canonical was the /en/-
  // prefixed URL. The canonical now is the bare path, so /<page>/ must
  // serve content directly.
  const localizedPages = await discoverLocalizedPages();
  await Promise.all(
    localizedPages.map(async (page) => {
      const src = path.join(outDir, 'en', page);
      const dest = path.join(outDir, page);
      try {
        await copyRecursive(src, dest);
        console.log(`[post-export] Mirrored /en/${page}/ → /${page}/`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.warn(`[post-export] Skipped /${page}/: /en/${page}/ missing`);
        } else {
          console.warn(`[post-export] Mirror /${page}/ failed:`, error.message);
        }
      }
    })
  );

  // Copy 404.html to out directory for GitHub Pages
  try {
    const src404 = path.join(process.cwd(), 'public', '404.html');
    const dest404 = path.join(outDir, '404.html');
    await fs.copyFile(src404, dest404);
    console.log('[post-export] Copied 404.html for GitHub Pages');
  } catch (error) {
    console.warn('[post-export] Failed to copy 404.html:', error.message);
  }

  // Strip `<script src="...css">` tags emitted by Next.js 14.2 next/font.
  // Run last so it covers the locale flat copies and the 404 page too.
  try {
    const htmlFiles = await walkHtmlFiles(outDir);
    let stripped = 0;
    for (const file of htmlFiles) {
      const before = await fs.readFile(file, 'utf8');
      const after = stripCssAsScriptTags(before);
      if (before !== after) {
        await fs.writeFile(file, after, 'utf8');
        stripped++;
      }
    }
    if (stripped > 0) {
      console.log(`[post-export] Stripped bogus CSS-as-script tags from ${stripped} HTML file(s)`);
    }
  } catch (error) {
    console.warn('[post-export] Failed to strip CSS-as-script tags:', error.message);
  }
}

run().catch((error) => {
  console.error('[post-export] Fatal error:', error);
  process.exit(1);
});
