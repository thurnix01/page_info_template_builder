// sync-css-to-export.js
// Usage: node scripts/sync-css-to-export.js

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/TemplateBuilder.css');
const tsxPath = path.join(__dirname, '../src/TemplateBuilder.tsx');

const css = fs.readFileSync(cssPath, 'utf8');
let tsx = fs.readFileSync(tsxPath, 'utf8');

const cssString = `\n${css.replace(/`/g, '\`')}\n`;

// Find the start of the CSS string in generateExport
const cssStart = tsx.indexOf('const css = `');
if (cssStart === -1) {
  console.error('Could not find CSS export string in TemplateBuilder.tsx');
  process.exit(1);
}
const cssEnd = tsx.indexOf('`;', cssStart + 12);
if (cssEnd === -1) {
  console.error('Could not find end of CSS export string in TemplateBuilder.tsx');
  process.exit(1);
}

const before = tsx.slice(0, cssStart + 13); // include the opening backtick
const after = tsx.slice(cssEnd);

const newTsx = before + cssString + after;

fs.writeFileSync(tsxPath, newTsx, 'utf8');
console.log('CSS export string updated in TemplateBuilder.tsx'); 