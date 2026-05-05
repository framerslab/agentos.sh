import { promises as fs } from 'node:fs';
import path from 'node:path';

const locales = ['en', 'zh', 'ko', 'ja', 'es', 'de', 'fr', 'pt'];
const outDir = path.resolve(process.cwd(), 'out');

// Pages that need locale redirects (redirect /docs → /en/docs/, etc.)
const localizedPages = ['docs', 'about', 'faq', 'blog', 'careers', 'legal'];

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

async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
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

async function createRedirectHTML(targetPath) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${targetPath}">
  <link rel="canonical" href="${targetPath}">
  <script>window.location.href="${targetPath}"</script>
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="${targetPath}">${targetPath}</a>...</p>
</body>
</html>`;
}

async function run() {
  // Serve the English homepage HTML directly at `/` instead of the
  // 64-byte meta-refresh stub from `public/index.html`. The stub
  // imposes a ~750ms PageSpeed penalty (`redirects` opportunity) and
  // there is no functional reason for the redirect: internal links go
  // to `/en/...`, the in-HTML canonical points to `/en/`, and locale
  // detection happens via middleware/links, not the URL of `/`.
  //
  // We overwrite `out/index.html` (which Next.js copied from
  // `public/index.html`) with the rendered `out/en/index.html`.
  try {
    const enHtmlSrc = path.join(outDir, 'en', 'index.html');
    const rootHtmlDest = path.join(outDir, 'index.html');
    await fs.copyFile(enHtmlSrc, rootHtmlDest);
    console.log('[post-export] Replaced root index.html with /en/ homepage (kills redirect stub)');
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

  // Create redirect HTML files for non-locale paths
  await Promise.all(
    localizedPages.map(async (page) => {
      const pageDir = path.join(outDir, page);
      const indexFile = path.join(pageDir, 'index.html');
      const targetPath = `/en/${page}/`;

      await ensureDir(pageDir);
      const redirectHtml = await createRedirectHTML(targetPath);
      await fs.writeFile(indexFile, redirectHtml, 'utf-8');
      console.log(`[post-export] Created redirect: /${page}/ → ${targetPath}`);
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

