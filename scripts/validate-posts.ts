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
  const requiredKeys = ['title', 'slug', 'date'];
  
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
    const dirNames = fs.readdirSync(postsDirectory);
    
    dirNames.forEach(dirName => {
      const fullDir = path.join(postsDirectory, dirName);
      if (fs.statSync(fullDir).isDirectory()) {
         const contentPath = path.join(fullDir, 'content.md');
         if (!fs.existsSync(contentPath)) {
            console.error(`❌ Error in ${dirName}: Missing 'content.md' file.`);
            hasErrors = true;
         } else {
            const result = validatePost(contentPath);
            if (!result.valid) {
               console.error(`❌ Error in ${dirName}/content.md:`);
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
