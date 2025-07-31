const { execSync } = require('child_process');
const path = require('path');

try {
    console.log('Starting build process...');

    // Use node to execute vite directly
    const vitePath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
    execSync(`node "${vitePath}" build`, {
        stdio: 'inherit',
        cwd: __dirname
    });

    console.log('Build completed successfully!');
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
} 