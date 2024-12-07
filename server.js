const https = require('https');
const fs = require('fs');
const os = require('os');
const sirv = require('sirv');
const httpsLocalhost = require('https-localhost')();

// Serve static files from the "public" directory
const app = sirv('public', { dev: true });

// HTTPS options with the certificate and key
const options = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert')
};

// Function to get the local network IP address
function getLocalNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost'; // Fallback if no network IP is found
}

// Create the HTTPS server
https.createServer(options, (req, res) => {
  app(req, res);
}).listen(5000, () => {
  const localIP = 'https://localhost:5000';
  const networkIP = `https://${getLocalNetworkIP()}:5000`;

  console.log(`HTTPS server running at:\n - Local: ${localIP}\n - Network: ${networkIP}`);
});
