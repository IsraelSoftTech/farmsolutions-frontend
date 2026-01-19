const fs = require('fs');
const path = require('path');

// Copy logo from src/assets to public folder
const sourcePath = path.join(__dirname, 'src', 'assets', 'logo.png');
const destPaths = [
  path.join(__dirname, 'public', 'logo192.png'),
  path.join(__dirname, 'public', 'logo512.png'),
  path.join(__dirname, 'public', 'favicon.png')
];

if (fs.existsSync(sourcePath)) {
  destPaths.forEach(destPath => {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied logo to ${path.basename(destPath)}`);
  });
  console.log('Logo copied successfully!');
} else {
  console.error('Logo file not found at:', sourcePath);
}
