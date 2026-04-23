/**
 * Build script: extract inline <script> from index.html,
 * obfuscate with javascript-obfuscator, reassemble into dist/index.html.
 * CSS is minified by stripping comments and collapsing whitespace.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import JavaScriptObfuscator from 'javascript-obfuscator';

const src = readFileSync('index.html', 'utf-8');

// ---- Extract and obfuscate <script> ----
const scriptRe = /(<script>)([\s\S]*?)(<\/script>)/g;
let out = src;

out = out.replace(scriptRe, (_, open, code, close) => {
  const result = JavaScriptObfuscator.obfuscate(code, {
    // Deep obfuscation settings
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: true,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayEncoding: ['base64', 'rc4'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 2,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.75,
    splitStrings: true,
    splitStringsChunkLength: 10,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
  });
  return open + result.getObfuscatedCode() + close;
});

// ---- Minify inline <style> ----
const styleRe = /(<style>)([\s\S]*?)(<\/style>)/g;
out = out.replace(styleRe, (_, open, css, close) => {
  const minified = css
    .replace(/\/\*[\s\S]*?\*\//g, '')   // remove comments
    .replace(/\s*\n\s*/g, '')           // collapse newlines
    .replace(/\s*([{}:;,>~+])\s*/g, '$1') // collapse around symbols
    .replace(/;}/g, '}')               // remove trailing semicolons
    .trim();
  return open + minified + close;
});

// ---- Write dist ----
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', out, 'utf-8');

// Copy all non-build assets (images, icons, etc.)
const skipFiles = new Set(['index.html', 'package.json', 'package-lock.json', 'build.mjs', 'node_modules', '.git', '.github', 'dist']);
for (const f of readdirSync('.')) {
  if (skipFiles.has(f)) continue;
  try { copyFileSync(f, `dist/${f}`); } catch {}
}

console.log('✓ Built obfuscated dist/index.html');
