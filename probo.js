const http = require('http');

// Bot state variables
let balance = 10000;  // Starting price
let holdings = 0;     //  inital holdings
let purchasePrice = 0; // Last purchase price

// Function to fetch stock price using  http module
function fetchStockPrice(stockId, callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/stocks/${stockId}`,
    method: 'GET',
  };

  const req = http.request(options, (res) => {
    let data = '';

    // Gather response data
    res.on('data', (chunk) => {
      data += chunk;
    });

    // respose on end
    res.on('end', () => {
      if (res.statusCode === 200) {
        const stock = JSON.parse(data);
        callback(stock.price);
      } else {
        console.log('Error fetching stock:', res.statusCode);
      }
    });
  });

  // Handle request errors
  req.on('error', (error) => {
    console.error('Error fetching stock price:', error.message);
  });

  req.end();
}

// Function to apply trading logic
function tradeprobo(stockId) {
  fetchStockPrice(stockId, (price) => {
    console.log(`Current price for stock ${stockId}: ${price}`);

    // Buy logic: 
    if (holdings === 0 && (purchasePrice === 0 || price < purchasePrice * 0.98)) {
      holdings = balance / price;  // Buy stocks
      purchasePrice = price;
      balance = 0;
      console.log(`Bought at price: ${price}`);
    }

    // Sell logic
    if (holdings > 0 && price > purchasePrice * 1.03) {
      balance = holdings * price;  // Sell all holdings
      holdings = 0;
      const profit = balance - 10000;  // Calculate profit/loss
      console.log(`Sold at price: ${price}, Profit/Loss: ${profit}`);
    }

    // Log current status
    if (holdings > 0) {
      console.log(`Currently holding: ${holdings.toFixed(2)} stocks, Purchase price: ${purchasePrice}`);
    } else {
      console.log(`Current balance: ${balance.toFixed(2)}`);
    }
  });
}

// Run the js file in every 10sec.
setInterval(() => {
  tradeprobo(1);  // Monitoring stock with ID 1
}, 10000);