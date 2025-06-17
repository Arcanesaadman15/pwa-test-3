#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    for (const address of addresses) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

console.log('🚀 Starting PWA for mobile testing...');
console.log('📱 Your local IP address:', localIP);
console.log('');

// Start the backend server
console.log('🔧 Starting backend server...');
const backend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: 'development' }
});

// Start the frontend server
console.log('🔧 Starting frontend server...');
const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--mode', 'mobile'], {
  stdio: 'inherit',
  shell: true,
  cwd: './client'
});

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});

// Print access URLs after a delay
setTimeout(() => {
  console.log('\n📱 MOBILE ACCESS URLS:');
  console.log('🌐 Frontend (use this on your phone):', `http://${localIP}:5173`);
  console.log('🔧 Backend API:', `http://${localIP}:3000`);
  console.log('');
  console.log('📝 Instructions:');
  console.log('1. Make sure your phone is on the same WiFi network');
  console.log('2. Open your phone browser');
  console.log(`3. Go to: http://${localIP}:5173`);
  console.log('4. Install the PWA when prompted!');
  console.log('');
  console.log('💡 Tip: If you get connection errors, check your computer\'s firewall settings');
}, 3000); 