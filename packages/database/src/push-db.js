const { execSync } = require('child_process');

try {
  // Using 'echo' with multiple enters to handle interactive prompts
  const output = execSync('echo "\n\n\n\n\n\n" | npx drizzle-kit push --force', {
    cwd: 'c:/Users/rumah/shadcn-template/packages/database',
    encoding: 'utf-8',
    stdio: 'inherit'
  });
  console.log('Push successful');
} catch (error) {
  console.error('Push failed', error.message);
}
