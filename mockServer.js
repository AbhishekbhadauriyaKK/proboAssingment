const http = require('http');

// Mock stock data
const stocks = {
  1: { symbol: 'AAPL', price: 150.5 },
  2: { symbol: 'GOOGL', price: 2750.3 }
};

// Create an HTTP server 
http.createServer((req, res) => {
  const stockId = req.url.split('/').pop();  // Get stock ID from URL
  
  const stock = stocks[stockId];  // Get stock data based on the ID
  
  if (stock) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stock));  // Return stock data in JSON format
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Stock not found');
  }
}).listen(3000, () => {
  console.log('server running at http://localhost:3000');
});