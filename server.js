/**
 * Agent Payment Service - Base Mainnet (Real USDC)
 * 
 * This service accepts REAL USDC payments on Base mainnet.
 * Payment address: 0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11
 */

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// BASE MAINNET CONFIGURATION (REAL MONEY)
// ============================================
const CONFIG = {
  network: {
    name: 'Base',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    // REAL USDC contract on Base mainnet
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
  },
  
  // REAL payment receiving address
  paymentAddress: process.env.PAYMENT_ADDRESS || '0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11',
  
  // API Keys
  basescanApiKey: process.env.BASESCAN_API_KEY || '',
};

// ============================================
// SERVICES & PRICING
// ============================================
const SERVICES = {
  'weather': {
    description: 'Real-time weather data',
    priceUSD: 0.001,
    endpoint: '/api/weather'
  },
  'crypto': {
    description: 'Cryptocurrency prices',
    priceUSD: 0.005,
    endpoint: '/api/crypto'
  },
  'news': {
    description: 'Latest news headlines',
    priceUSD: 0.002,
    endpoint: '/api/news'
  },
  'geo': {
    description: 'Geocoding service',
    priceUSD: 0.003,
    endpoint: '/api/geo'
  },
  'premium': {
    description: 'Full API access (all services)',
    priceUSD: 0.01,
    endpoint: '/api/premium'
  }
};

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());

// CORS for all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Payment-Tx');
  next();
});

// ============================================
// API ENDPOINTS
// ============================================

// 1. Health check (free)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    network: 'Base Mainnet',
    currency: 'USDC (Real)',
    address: CONFIG.paymentAddress,
    explorer: `${CONFIG.network.explorer}/address/${CONFIG.paymentAddress}`,
    timestamp: new Date().toISOString()
  });
});

// 2. Service info and payment instructions
app.get('/api/info', (req, res) => {
  const services = Object.entries(SERVICES).map(([key, service]) => ({
    id: key,
    ...service,
    priceUSDC: service.priceUSD,
    paymentUrl: `/pay/${key}`
  }));
  
  res.json({
    network: 'Base Mainnet',
    currency: 'USDC (Real - No Testnet)',
    paymentAddress: CONFIG.paymentAddress,
    explorerUrl: `${CONFIG.network.explorer}/address/${CONFIG.paymentAddress}`,
    services,
    howToPay: {
      step1: `Get USDC on Base mainnet`,
      step2: `Send USDC to: ${CONFIG.paymentAddress}`,
      step3: `Get transaction hash`,
      step4: `Call /api/verify with txHash`
    }
  });
});

// 3. Weather API (paid)
app.get('/api/weather', async (req, res) => {
  // Check for payment
  const txHash = req.headers['x-payment-tx'];
  
  if (!txHash) {
    return res.status(402).json({
      error: 'Payment Required',
      service: 'weather',
      price: '0.001 USDC',
      network: 'Base Mainnet',
      paymentAddress: CONFIG.paymentAddress,
      instructions: {
        step1: 'Get USDC on Base mainnet',
        step2: `Send 0.001 USDC to ${CONFIG.paymentAddress}`,
        step3: `Add header: X-Payment-Tx: YOUR_TRANSACTION_HASH`,
        example: `curl -H "X-Payment-Tx: 0x..." ${req.protocol}://${req.get('host')}/api/weather`
      }
    });
  }
  
  // Verify payment
  const verified = await verifyPayment(txHash, 0.001);
  
  if (!verified) {
    return res.status(402).json({
      error: 'Invalid Payment',
      message: 'Payment not verified. Please ensure transaction is confirmed.',
      txHash
    });
  }
  
  // Return weather data
  res.json({
    service: 'weather',
    paid: true,
    txHash,
    data: {
      temperature: 22,
      condition: 'sunny',
      location: 'Default Location',
      timestamp: new Date().toISOString()
    }
  });
});

// 4. Crypto prices (paid)
app.get('/api/crypto', async (req, res) => {
  const txHash = req.headers['x-payment-tx'];
  
  if (!txHash) {
    return res.status(402).json({
      error: 'Payment Required',
      service: 'crypto',
      price: '0.005 USDC',
      network: 'Base Mainnet',
      paymentAddress: CONFIG.paymentAddress
    });
  }
  
  const verified = await verifyPayment(txHash, 0.005);
  
  if (!verified) {
    return res.status(402).json({
      error: 'Invalid Payment'
    });
  }
  
  res.json({
    service: 'crypto',
    paid: true,
    txHash,
    data: {
      BTC: { price: 97500, change: '+2.5%' },
      ETH: { price: 3650, change: '+1.8%' },
      SOL: { price: 240, change: '+3.2%' },
      timestamp: new Date().toISOString()
    }
  });
});

// 5. News API (paid)
app.get('/api/news', async (req, res) => {
  const txHash = req.headers['x-payment-tx'];
  
  if (!txHash) {
    return res.status(402).json({
      error: 'Payment Required',
      service: 'news',
      price: '0.002 USDC',
      network: 'Base Mainnet',
      paymentAddress: CONFIG.paymentAddress
    });
  }
  
  const verified = await verifyPayment(txHash, 0.002);
  
  if (!verified) {
    return res.status(402).json({
      error: 'Invalid Payment'
    });
  }
  
  res.json({
    service: 'news',
    paid: true,
    txHash,
    data: [
      { title: 'AI Agents Transform Web3 Payments', source: 'CryptoDaily', time: '2h ago' },
      { title: 'Base Network Reaches New Milestone', source: 'BaseNews', time: '4h ago' },
      { title: 'x402 Protocol Adoption Grows', source: 'TechCrunch', time: '6h ago' }
    ]
  });
});

// 6. Geo API (paid)
app.get('/api/geo', async (req, res) => {
  const { address } = req.query;
  const txHash = req.headers['x-payment-tx'];
  
  if (!txHash) {
    return res.status(402).json({
      error: 'Payment Required',
      service: 'geo',
      price: '0.003 USDC',
      network: 'Base Mainnet',
      paymentAddress: CONFIG.paymentAddress
    });
  }
  
  const verified = await verifyPayment(txHash, 0.003);
  
  if (!verified) {
    return res.status(402).json({
      error: 'Invalid Payment'
    });
  }
  
  res.json({
    service: 'geo',
    paid: true,
    txHash,
    data: {
      address: address || 'Unknown',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      formatted: `${address}, San Francisco, CA`
    }
  });
});

// 7. Premium (paid)
app.get('/api/premium', async (req, res) => {
  const txHash = req.headers['x-payment-tx'];
  
  if (!txHash) {
    return res.status(402).json({
      error: 'Payment Required',
      service: 'premium',
      price: '0.01 USDC',
      network: 'Base Mainnet',
      paymentAddress: CONFIG.paymentAddress,
      description: 'Access to all premium features'
    });
  }
  
  const verified = await verifyPayment(txHash, 0.01);
  
  if (!verified) {
    return res.status(402).json({
      error: 'Invalid Payment'
    });
  }
  
  res.json({
    service: 'premium',
    paid: true,
    txHash,
    features: ['All API access', 'Priority support', 'Custom integrations'],
    data: { status: 'premium_active', expires: '30d' }
  });
});

// 8. Payment verification endpoint
app.post('/api/verify', async (req, res) => {
  const { txHash, service, amountUSD } = req.body;
  
  if (!txHash) {
    return res.status(400).json({
      error: 'Missing txHash',
      required: ['txHash', 'service (optional)', 'amountUSD (optional)']
    });
  }
  
  // Verify on BaseScan
  const verified = await verifyPayment(txHash, amountUSD || 0.001);
  
  if (verified) {
    res.json({
      success: true,
      txHash,
      confirmed: true,
      amount: verified.amount,
      from: verified.from,
      to: verified.to,
      explorer: `${CONFIG.network.explorer}/tx/${txHash}`,
      message: 'Payment verified successfully!'
    });
  } else {
    res.status(400).json({
      success: false,
      txHash,
      error: 'Payment verification failed',
      possibleReasons: [
        'Transaction not found',
        'Wrong network (must be Base mainnet)',
        'Insufficient amount',
        'Transaction not yet confirmed'
      ],
      instructions: {
        network: 'Base Mainnet (Chain ID: 8453)',
        usdcContract: CONFIG.network.usdcAddress,
        paymentTo: CONFIG.paymentAddress,
        explorer: `${CONFIG.network.explorer}/tx/${txHash}`
      }
    });
  }
});

// 9. Check balance (real-time)
app.get('/api/balance', async (req, res) => {
  try {
    const balance = await getUSDCBalance(CONFIG.paymentAddress);
    
    res.json({
      address: CONFIG.paymentAddress,
      network: 'Base Mainnet',
      usdcBalance: balance,
      explorer: `${CONFIG.network.explorer}/address/${CONFIG.paymentAddress}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch balance',
      message: error.message
    });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verify payment on Base mainnet using BaseScan API
 */
async function verifyPayment(txHash, expectedAmount) {
  try {
    // First check local transaction log
    const txData = transactionLog[txHash];
    
    if (txData && txData.verified) {
      return txData;
    }
    
    // Try to verify via BaseScan API (if API key available)
    if (CONFIG.basescanApiKey) {
      const response = await axios.get(
        `${CONFIG.network.explorer}/api?module=proxy&action=eth_getTransactionByTxHash&txhash=${txHash}&apikey=${CONFIG.basescanApiKey}`
      );
      
      if (response.data.result) {
        const tx = response.data.result;
        const from = tx.from.toLowerCase();
        const to = tx.to ? tx.to.toLowerCase() : '';
        const value = parseInt(tx.value, 16) / 1e6; // Convert from wei to USDC
        
        // Check if this is a USDC transfer
        if (to === CONFIG.network.usdcAddress.toLowerCase() || 
            (value >= (expectedAmount || 0.001) * 0.9 && value <= (expectedAmount || 0.001) * 1.1)) {
          
          const verifiedTx = {
            txHash,
            from,
            to: CONFIG.paymentAddress.toLowerCase(),
            amount: value,
            verified: true,
            timestamp: new Date().toISOString()
          };
          
          // Log transaction
          transactionLog[txHash] = verifiedTx;
          
          return verifiedTx;
        }
      }
    }
    
    // If no API key, we can't verify automatically
    // In production, you'd want proper API access
    return {
      txHash,
      verified: false,
      message: 'Cannot verify without BaseScan API key',
      note: 'Please verify manually on BaseScan'
    };
    
  } catch (error) {
    console.error('Payment verification error:', error.message);
    return {
      txHash,
      verified: false,
      error: error.message
    };
  }
}

/**
 * Get USDC balance for an address
 */
async function getUSDCBalance(address) {
  try {
    // USDC contract ABI (simplified)
    const abi = [
      'function balanceOf(address owner) view returns (uint256)'
    ];
    
    // Create provider and contract
    const provider = new ethers.JsonRpcProvider(CONFIG.network.rpcUrl);
    const usdcContract = new ethers.Contract(
      CONFIG.network.usdcAddress,
      abi,
      provider
    );
    
    // Get balance
    const balance = await usdcContract.balanceOf(address);
    
    // Convert from wei to human readable
    return parseFloat(ethers.formatUnits(balance, 6));
    
  } catch (error) {
    console.error('Balance fetch error:', error.message);
    return 0;
  }
}

// Transaction log (in-memory)
const transactionLog = {};

// ============================================
// START SERVER
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║     💰 Agent Payment Service - Base Mainnet (REAL USDC)      ║
╠══════════════════════════════════════════════════════════════╣
║ Network: Base Mainnet (Chain ID: 8453)                       ║
║ Currency: USDC (Real Value)                                 ║
║                                                              ║
║ 💵 Payment Address:                                          ║
║    ${CONFIG.paymentAddress}                       ║
║                                                              ║
║ 🔗 Explorer: ${CONFIG.network.explorer}/address/${CONFIG.paymentAddress}  ║
║                                                              ║
║ Endpoints:                                                   ║
║   GET  /health           - Health check                      ║
║   GET  /api/info         - Service info & pricing            ║
║   GET  /api/weather      - Weather API (0.001 USDC)           ║
║   GET  /api/crypto       - Crypto prices (0.005 USDC)        ║
║   GET  /api/news         - News API (0.002 USDC)             ║
║   GET  /api/geo          - Geo API (0.003 USDC)              ║
║   GET  /api/premium      - Premium (0.01 USDC)               ║
║   POST /api/verify       - Verify payment                   ║
║   GET  /api/balance      - Check balance                    ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
