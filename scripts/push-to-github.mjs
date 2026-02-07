import fs from 'fs';
import path from 'path';
import https from 'https';

const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const OWNER = 'baw555';
const REPO = 'operationfiscalfreedom';
const BRANCH = 'main';

const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', '.cache', '.local', '.config', '.upm', 'tmp', 'scripts', 'attached_assets'
]);
const IGNORE_FILES = new Set([
  'package-lock.json', '.replit', '.breakpoints'
]);
const IGNORE_EXTENSIONS = new Set(['.lock']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit to speed up push

function shouldIgnore(filePath) {
  const parts = filePath.split('/');
  for (const part of parts) {
    if (IGNORE_DIRS.has(part)) return true;
  }
  const basename = path.basename(filePath);
  if (IGNORE_FILES.has(basename)) return true;
  const ext = path.extname(basename);
  if (IGNORE_EXTENSIONS.has(ext)) return true;
  return false;
}

function getAllFiles(dir, base = '') {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        results.push(...getAllFiles(path.join(dir, entry.name), rel));
      }
    } else {
      if (!shouldIgnore(rel)) {
        const fullPath = path.join(dir, entry.name);
        const stat = fs.statSync(fullPath);
        if (stat.size <= MAX_FILE_SIZE) {
          results.push(rel);
        } else {
          console.log(`  Skipping large file (${(stat.size / 1024 / 1024).toFixed(1)}MB): ${rel}`);
        }
      }
    }
  }
  return results;
}

function ghApi(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${OWNER}/${REPO}${endpoint}`,
      method,
      headers: {
        'Authorization': `token ${TOKEN}`,
        'User-Agent': 'NavigatorUSA-Push',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`GitHub API ${res.statusCode}: ${parsed.message || data}`));
          } else {
            resolve(parsed);
          }
        } catch {
          if (res.statusCode >= 400) reject(new Error(`GitHub API ${res.statusCode}: ${data}`));
          else resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function isBinary(filePath) {
  const binaryExts = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.pdf', '.zip', '.tar', '.gz', '.mp3', '.mp4', '.wav', '.webp', '.svg']);
  return binaryExts.has(path.extname(filePath).toLowerCase());
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function createBlob(filePath, retries = 3) {
  const fullPath = path.join(process.cwd(), filePath);
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (isBinary(filePath)) {
        const content = fs.readFileSync(fullPath).toString('base64');
        return await ghApi('POST', '/git/blobs', { content, encoding: 'base64' });
      } else {
        const content = fs.readFileSync(fullPath, 'utf-8');
        return await ghApi('POST', '/git/blobs', { content, encoding: 'utf-8' });
      }
    } catch (err) {
      if (err.message.includes('rate limit') && attempt < retries - 1) {
        const wait = (attempt + 1) * 10000;
        console.log(`    Rate limited on ${path.basename(filePath)}, waiting ${wait/1000}s...`);
        await sleep(wait);
      } else {
        throw err;
      }
    }
  }
}

async function main() {
  console.log('Collecting files...');
  const files = getAllFiles(process.cwd());
  console.log(`Found ${files.length} files to push`);

  let parentSha = null;
  let baseTreeSha = null;
  try {
    const ref = await ghApi('GET', `/git/ref/heads/${BRANCH}`);
    parentSha = ref.object.sha;
    const commit = await ghApi('GET', `/git/commits/${parentSha}`);
    baseTreeSha = commit.tree.sha;
    console.log(`Existing branch found, parent commit: ${parentSha.slice(0,7)}`);
  } catch {
    console.log('No existing branch, creating fresh');
  }

  const BATCH_SIZE = 15;
  const treeItems = [];
  const skipped = [];

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(f => createBlob(f).then(b => ({ path: f, sha: b.sha })))
    );
    let hitRateLimit = false;
    for (let j = 0; j < results.length; j++) {
      if (results[j].status === 'fulfilled') {
        const blob = results[j].value;
        treeItems.push({ path: blob.path, mode: '100644', type: 'blob', sha: blob.sha });
      } else {
        if (results[j].reason.message.includes('rate limit')) {
          hitRateLimit = true;
        }
        skipped.push(batch[j]);
      }
    }
    console.log(`  Processed ${Math.min(i + BATCH_SIZE, files.length)}/${files.length} (${treeItems.length} ok, ${skipped.length} skipped)`);
    if (hitRateLimit) {
      console.log('  Rate limited, waiting 30s...');
      await sleep(30000);
    }
  }

  if (skipped.length > 0) {
    console.log(`\nWarning: ${skipped.length} files skipped due to errors`);
  }

  console.log('Creating tree...');
  const treePayload = { tree: treeItems };
  if (baseTreeSha) treePayload.base_tree = baseTreeSha;
  const tree = await ghApi('POST', '/git/trees', treePayload);

  console.log('Creating commit...');
  const commitPayload = {
    message: `Sync from Replit — ${new Date().toISOString().split('T')[0]} — PHI Vault + routes wired`,
    tree: tree.sha,
    parents: parentSha ? [parentSha] : [],
  };
  const commit = await ghApi('POST', '/git/commits', commitPayload);

  console.log('Updating ref...');
  try {
    await ghApi('PATCH', `/git/refs/heads/${BRANCH}`, { sha: commit.sha, force: true });
  } catch {
    await ghApi('POST', '/git/refs', { ref: `refs/heads/${BRANCH}`, sha: commit.sha });
  }

  console.log(`\nPush complete! Commit: ${commit.sha.slice(0,7)}`);
  console.log(`View at: https://github.com/${OWNER}/${REPO}`);
}

main().catch(err => {
  console.error('Push failed:', err.message);
  process.exit(1);
});
