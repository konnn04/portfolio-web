import fs from 'fs';
import path from 'path';

// Simplified validation script to check post metadata
const postsDirectory = path.join(process.cwd(), 'posts');

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validatePost(filePath: string): ValidationResult {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const errors: string[] = [];

  const headerMatch = fileContents.match(/<!--\s*Header\s*-->\s*([\s\S]*?)\s*<!--\s*Content\s*-->/i);
  if (!headerMatch) {
    errors.push("Missing <!-- Header --> or <!-- Content --> tags.");
    return { valid: false, errors };
  }

  const headerRaw = headerMatch[1];
  // slug is now from folder name, not required in metadata
  const requiredKeys = ['title', 'date'];
  
  for (const key of requiredKeys) {
      const regex = new RegExp(`^\\s*-\\s*${key}\\s*:`, 'm');
      if (!regex.test(headerRaw)) {
          errors.push(`Missing required metadata key: ${key}`);
      }
  }

  return { valid: errors.length === 0, errors };
}

function main() {
  console.log('Validating posts...');
  let hasErrors = false;

  if (fs.existsSync(postsDirectory)) {
    const dirNames = fs.readdirSync(postsDirectory).filter(d => !d.startsWith("_")); // Skip folders starting with "_"

    dirNames.forEach(dirName => {
      const fullDir = path.join(postsDirectory, dirName);
      if (fs.statSync(fullDir).isDirectory()) {
         // Check for any content file (content.md, content_en.md, content_vi.md)
         const hasContentMd = fs.existsSync(path.join(fullDir, 'content.md'));
         const hasContentEn = fs.existsSync(path.join(fullDir, 'content_en.md'));
         const hasContentVi = fs.existsSync(path.join(fullDir, 'content_vi.md'));

         if (!hasContentMd && !hasContentEn && !hasContentVi) {
            console.error(`❌ Error in ${dirName}: Missing content file (content.md, content_en.md, or content_vi.md).`);
            hasErrors = true;
         } else {
            // Validate the English or default content file
            const contentPath = hasContentMd
              ? path.join(fullDir, 'content.md')
              : hasContentEn ? path.join(fullDir, 'content_en.md') : path.join(fullDir, 'content_vi.md');

            const result = validatePost(contentPath);
            if (!result.valid) {
               console.error(`❌ Error in ${dirName}:`);
               result.errors.forEach(err => console.error(`  - ${err}`));
               hasErrors = true;
            } else {
               console.log(`✅ ${dirName} is valid.`);
            }
         }
      }
    });
  }

  if (hasErrors) {
    console.error('\nValidation failed. Please fix the errors above before committing.');
    process.exit(1);
  } else {
    console.log('\nAll posts are valid!');
    process.exit(0);
  }
}

main();
