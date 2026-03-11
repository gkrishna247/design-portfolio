/* eslint-env node */
import fs from 'fs';
import path from 'path';

// Known dynamic inline CSS variables that are injected via React style={{ '--var': value }}
const IGNORED_DYNAMIC_VARS = new Set([
  '--category-color',
  '--exp-color',
  '--link-color',
  '--project-color',
  '--ring-color',
  '--skill-opacity'
]);

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.css') || name.endsWith('.jsx') || name.endsWith('.js')) {
      files.push(name);
    }
  }
  return files;
}

function auditCssVars() {
  const indexCssPath = path.resolve(process.cwd(), 'src/styles/index.css');
  if (!fs.existsSync(indexCssPath)) {
    console.error(`Error: Could not find ${indexCssPath}`);
    process.exit(1);
  }

  const indexCss = fs.readFileSync(indexCssPath, 'utf8');

  // Extract all variables defined in :root or anywhere in index.css
  const definedVars = new Set();
  const definedRegex = /(--[a-zA-Z0-9_-]+)\s*:/g;
  let match;
  while ((match = definedRegex.exec(indexCss)) !== null) {
    definedVars.add(match[1]);
  }

  const srcFiles = getFiles(path.resolve(process.cwd(), 'src'));

  const usedVars = new Map(); // varName -> Set of files where it's used

  const usedRegex = /var\(\s*(--[a-zA-Z0-9_-]+)/g;

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    let useMatch;
    while ((useMatch = usedRegex.exec(content)) !== null) {
      const varName = useMatch[1];
      if (IGNORED_DYNAMIC_VARS.has(varName)) continue;

      if (!usedVars.has(varName)) {
        usedVars.set(varName, new Set());
      }
      usedVars.get(varName).add(file.replace(process.cwd() + '/', ''));
    }
  }

  let hasErrors = false;

  console.log('--- CSS Variable Audit ---');
  console.log(`Found ${definedVars.size} defined variables in src/styles/index.css.`);
  console.log(`Found ${usedVars.size} unique variable usages across the project.\n`);

  // 1. Check for missing variables
  const missingVars = [];
  for (const [varName, files] of usedVars.entries()) {
    if (!definedVars.has(varName)) {
      missingVars.push({ varName, files: Array.from(files) });
    }
  }

  if (missingVars.length > 0) {
    hasErrors = true;
    console.error('❌ Error: The following CSS variables are used but NOT defined in index.css:');
    missingVars.forEach(({ varName, files }) => {
      console.error(`  ${varName} (used in: ${files.join(', ')})`);
    });
    console.error('');
  } else {
    console.log('✅ All referenced CSS variables exist in index.css.\n');
  }

  // 2. Check for unused variables
  const unusedVars = [];
  for (const varName of definedVars) {
    if (!usedVars.has(varName) && !IGNORED_DYNAMIC_VARS.has(varName)) {
      unusedVars.push(varName);
    }
  }

  if (unusedVars.length > 0) {
    // Optionally we can fail the build on unused vars, or just warn
    console.warn('⚠️  Warning: The following CSS variables are defined in index.css but never used:');
    unusedVars.sort().forEach(varName => {
      console.warn(`  ${varName}`);
    });
    console.warn('');
    hasErrors = true; // Let's enforce keeping it clean
  } else {
    console.log('✅ No unused CSS variables found.\n');
  }

  if (hasErrors) {
    console.error('Audit failed. Please fix the missing or unused CSS variables.');
    process.exit(1);
  } else {
    console.log('Audit passed successfully! 🎉');
  }
}

auditCssVars();
