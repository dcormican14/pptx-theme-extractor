/**
 * Script to parse PowerPoint files in the uploads folder and produce
 * chit data for each file, matching the chit format/styling in Viewer.jsx.
 * 
 * This script extracts theme colors and basic slide info for each .pptx file.
 * 
 * Run with: node server.js
 */

const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const xml2js = require('xml2js');

const uploadsDir = path.join(__dirname, 'uploads');
const outputFile = path.join(__dirname, 'theme-viewer/public/data/chits.json');

async function extractThemeColors(extractPath) {
  const themePath = path.join(extractPath, 'ppt/theme/theme1.xml');
  if (!fs.existsSync(themePath)) return {};

  const xmlData = fs.readFileSync(themePath, 'utf-8');
  const parsed = await xml2js.parseStringPromise(xmlData);

  const clrScheme = parsed['a:theme']['a:themeElements'][0]['a:clrScheme'][0];

  // Collect all color tags and their values
  const colorDict = {};
  for (const [key, value] of Object.entries(clrScheme)) {
    // Only process color tags (keys starting with 'a:')
    if (!key.startsWith('a:')) continue;
    const tag = key.replace('a:', '');
    const node = value[0];
    let color = null;
    if (node['a:srgbClr'] && node['a:srgbClr'][0]?.['$']?.['val']) {
      color = `#${node['a:srgbClr'][0]['$']['val']}`;
    } else if (node['a:sysClr'] && node['a:sysClr'][0]?.['$']?.['lastClr']) {
      color = `#${node['a:sysClr'][0]['$']['lastClr']}`;
    } else if (node['a:schemeClr'] && node['a:schemeClr'][0]?.['$']?.['val']) {
      color = node['a:schemeClr'][0]['$']['val'];
    }
    colorDict[tag] = color;
  }

  return colorDict;
}

async function extractSlideTitles(extractPath) {
  // Returns an array of slide titles (if any)
  const slidesDir = path.join(extractPath, 'ppt/slides');
  if (!fs.existsSync(slidesDir)) return [];

  const slideFiles = fs.readdirSync(slidesDir)
    .filter(f => /^slide\d+\.xml$/.test(f))
    .sort((a, b) => {
      // Sort numerically by slide number
      const nA = parseInt(a.match(/\d+/)[0], 10);
      const nB = parseInt(b.match(/\d+/)[0], 10);
      return nA - nB;
    });

  const titles = [];
  for (const file of slideFiles) {
    const xml = fs.readFileSync(path.join(slidesDir, file), 'utf-8');
    const parsed = await xml2js.parseStringPromise(xml);
    // Try to find the first text in a title shape
    const shapes = parsed['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp'] || [];
    let foundTitle = null;
    for (const shape of shapes) {
      const props = shape['p:nvSpPr']?.[0]?.['p:nvPr']?.[0]?.['p:ph']?.[0]?.['$'];
      if (props && props.type === 'title') {
        // Find all text runs in this shape
        const paras = shape['p:txBody']?.[0]?.['a:p'] || [];
        for (const para of paras) {
          const runs = para['a:r'] || [];
          for (const run of runs) {
            const text = run['a:t']?.[0];
            if (text) {
              foundTitle = text;
              break;
            }
          }
          if (foundTitle) break;
        }
      }
      if (foundTitle) break;
    }
    titles.push(foundTitle || '');
  }
  return titles;
}

async function parsePptxToChit(pptxPath) {
  const extractPath = path.join(__dirname, 'extracted', path.basename(pptxPath, '.pptx'));
  // Ensure clean extraction
  if (fs.existsSync(extractPath)) {
    fs.rmSync(extractPath, { recursive: true, force: true });
  }
  await fs.createReadStream(pptxPath)
    .pipe(unzipper.Extract({ path: extractPath }))
    .promise();

  const theme = await extractThemeColors(extractPath);
  const slideTitles = await extractSlideTitles(extractPath);

  // Chit format: one chit per file, with theme and first slide title
  return {
    file: path.basename(pptxPath),
    theme,
    title: slideTitles[0] || 'Title',
    slideTitles,
  };
}

async function main() {
  const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.pptx'));
  const chits = [];
  for (const file of files) {
    try {
      const chit = await parsePptxToChit(path.join(uploadsDir, file));
      chits.push(chit);
    } catch (e) {
      console.error(`Error processing ${file}:`, e);
    }
  }
  fs.writeFileSync(outputFile, JSON.stringify(chits, null, 2), 'utf-8');
  console.log(`Wrote ${chits.length} chits to ${outputFile}`);
}

if (require.main === module) {
  main();
}