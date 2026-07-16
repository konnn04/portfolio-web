import fs from 'fs';
import path from 'path';

// All long-form content lives under the root `data/` folder, one folder per
// slug (posts and projects share the same header-block + content_{lang}.md shape):
//   data/posts/<slug>/content(_lang).md      — blog posts
//   data/projects/<slug>/content_{en,vi}.md  — project detail (+ assets/)
const postsDirectory = path.join(process.cwd(), 'data', 'posts');
const projectsDirectory = path.join(process.cwd(), 'data', 'projects');

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateHeader(filePath: string, requiredKeys: string[]): ValidationResult {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const errors: string[] = [];

  const headerMatch = fileContents.match(/<!--\s*Header\s*-->\s*([\s\S]*?)\s*<!--\s*Content\s*-->/i);
  if (!headerMatch) {
    errors.push('Missing <!-- Header --> or <!-- Content --> tags.');
    return { valid: false, errors };
  }
  const headerRaw = headerMatch[1];
  for (const key of requiredKeys) {
    const regex = new RegExp(`^\\s*-\\s*${key}\\b\\s*:`, 'mi');
    if (!regex.test(headerRaw)) errors.push(`Missing required metadata key: ${key}`);
  }
  return { valid: errors.length === 0, errors };
}

function validatePosts(): boolean {
  let hasErrors = false;
  if (!fs.existsSync(postsDirectory)) {
    console.log('ℹ No data/posts directory — skipping post validation.');
    return false;
  }
  const dirNames = fs.readdirSync(postsDirectory).filter((d) => !d.startsWith('_'));
  dirNames.forEach((dirName) => {
    const fullDir = path.join(postsDirectory, dirName);
    if (!fs.statSync(fullDir).isDirectory()) return;
    const hasContentMd = fs.existsSync(path.join(fullDir, 'content.md'));
    const hasContentEn = fs.existsSync(path.join(fullDir, 'content_en.md'));
    const hasContentVi = fs.existsSync(path.join(fullDir, 'content_vi.md'));

    if (!hasContentMd && !hasContentEn && !hasContentVi) {
      console.error(`❌ ${dirName}: missing content file (content.md, content_en.md, or content_vi.md).`);
      hasErrors = true;
      return;
    }
    const contentPath = hasContentMd
      ? path.join(fullDir, 'content.md')
      : hasContentEn
        ? path.join(fullDir, 'content_en.md')
        : path.join(fullDir, 'content_vi.md');
    const result = validateHeader(contentPath, ['title', 'datetime', 'author', 'description']);
    if (!result.valid) {
      console.error(`❌ post "${dirName}":`);
      result.errors.forEach((err) => console.error(`  - ${err}`));
      hasErrors = true;
    } else {
      console.log(`✅ post "${dirName}" is valid.`);
    }
  });
  return hasErrors;
}

function validateProjects(): boolean {
  let hasErrors = false;
  if (!fs.existsSync(projectsDirectory)) {
    console.log('ℹ No data/projects directory — skipping project validation.');
    return false;
  }
  const dirNames = fs.readdirSync(projectsDirectory).filter((d) => !d.startsWith('_'));
  dirNames.forEach((dirName) => {
    const fullDir = path.join(projectsDirectory, dirName);
    if (!fs.statSync(fullDir).isDirectory()) return;
    const hasEn = fs.existsSync(path.join(fullDir, 'content_en.md'));
    const hasVi = fs.existsSync(path.join(fullDir, 'content_vi.md'));
    if (!hasEn && !hasVi) {
      console.error(`❌ project "${dirName}": missing content_en.md / content_vi.md.`);
      hasErrors = true;
      return;
    }
    if (!hasEn || !hasVi) {
      console.warn(`⚠ project "${dirName}": missing ${!hasEn ? 'content_en.md' : 'content_vi.md'}.`);
    }
    // Validate the header of every language file that exists.
    for (const f of ['content_en.md', 'content_vi.md']) {
      const fp = path.join(fullDir, f);
      if (!fs.existsSync(fp)) continue;
      const result = validateHeader(fp, ['title', 'joinAt', 'description']);
      if (!result.valid) {
        console.error(`❌ project "${dirName}" (${f}):`);
        result.errors.forEach((err) => console.error(`  - ${err}`));
        hasErrors = true;
      }
    }
    if (!hasErrors) console.log(`✅ project "${dirName}" is valid.`);
  });
  return hasErrors;
}

function main() {
  console.log('Validating content in data/ ...\n');
  const postErrors = validatePosts();
  console.log('');
  const projectErrors = validateProjects();

  if (postErrors || projectErrors) {
    console.error('\nValidation failed. Please fix the errors above before committing.');
    process.exit(1);
  }
  console.log('\nAll content is valid!');
  process.exit(0);
}

main();
