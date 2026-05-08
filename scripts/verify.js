import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const cmd = process.argv[2] || 'all';

const filesToCheck = [
  path.join(root, 'index.html'),
  path.join(root, 'src/main.js'),
  path.join(root, 'src/data/site-content.js'),
  path.join(root, 'src/components/header.js'),
  path.join(root, 'src/components/hero.js'),
  path.join(root, 'src/components/community-board.js'),
  path.join(root, 'src/components/events-list.js'),
  path.join(root, 'src/components/modules.js'),
  path.join(root, 'src/components/features.js'),
  path.join(root, 'src/components/why-us.js'),
  path.join(root, 'src/components/contact.js'),
  path.join(root, 'src/components/footer.js'),
  path.join(root, 'src/router.js'),
  path.join(root, 'api/submit-share.js'),
  path.join(root, 'src/styles.css'),
];

function formatCheck() {
  let fail = false;
  for (const file of filesToCheck) {
    const data = fs.readFileSync(file, 'utf8');
    const lines = data.split('\n');

    lines.forEach((line, idx) => {
      if (/\s+$/.test(line)) {
        console.error(`Trailing whitespace in ${path.relative(root, file)}:${idx + 1}`);
        fail = true;
      }
    });

    if (!data.endsWith('\n')) {
      console.error(`Missing newline at EOF in ${path.relative(root, file)}`);
      fail = true;
    }
  }

  return fail;
}

function lintCheck() {
  try {
    execSync('node --check src/main.js', { stdio: 'inherit' });
    execSync('node --check src/data/site-content.js', { stdio: 'inherit' });
    execSync('node --check src/components/header.js', { stdio: 'inherit' });
    execSync('node --check src/components/hero.js', { stdio: 'inherit' });
    execSync('node --check src/components/community-board.js', { stdio: 'inherit' });
    execSync('node --check src/components/events-list.js', { stdio: 'inherit' });
    execSync('node --check src/components/modules.js', { stdio: 'inherit' });
    execSync('node --check src/components/features.js', { stdio: 'inherit' });
    execSync('node --check src/components/why-us.js', { stdio: 'inherit' });
    execSync('node --check src/components/contact.js', { stdio: 'inherit' });
    execSync('node --check src/components/footer.js', { stdio: 'inherit' });
    execSync('node --check src/router.js', { stdio: 'inherit' });
    execSync('node --check api/submit-share.js', { stdio: 'inherit' });
    execSync('node --check scripts/verify.js', { stdio: 'inherit' });
  } catch (error) {
    return true;
  }

  return false;
}

function ensureBuild() {
  const dist = path.join(root, 'dist');
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { force: true, recursive: true });
  }
  fs.mkdirSync(dist);
  fs.cpSync(path.join(root, 'index.html'), path.join(dist, 'index.html'), { force: true });
  fs.cpSync(path.join(root, 'src'), path.join(dist, 'src'), { recursive: true, force: true });
  fs.cpSync(path.join(root, 'public'), path.join(dist, 'public'), { recursive: true, force: true });
  fs.cpSync(path.join(root, 'api'), path.join(dist, 'api'), { recursive: true, force: true });
  fs.cpSync(path.join(root, 'vercel.json'), path.join(dist, 'vercel.json'), { force: true });
  return dist;
}

function run(command) {
  if (command === 'format' || command === 'all') {
    const failedFormat = formatCheck();
    if (failedFormat) return true;
  }

  if (command === 'lint' || command === 'all') {
    const failedLint = lintCheck();
    if (failedLint) return true;
  }

  if (command === 'build' || command === 'all') {
    ensureBuild();
  }

  return false;
}

const failed = run(cmd);
if (failed) process.exit(1);