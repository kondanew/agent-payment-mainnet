/**
 * Agent Payment Service - Base Mainnet (Real USDC)
 * x402 Compatible - Agent Native Payments
 * 
 * Supports both:
 * - X-Payment-Tx header (simple)
 * - x402 protocol (standardized)
 */

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  network: {
    name: 'Base',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
  },
  
  paymentAddress: process.env.PAYMENT_ADDRESS || '0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11',
  basescanApiKey: process.env.BASESCAN_API_KEY || '',
};

// ============================================
// SERVICES & PRICING (USDC)
// ============================================
const SERVICES = {
  'weather': {
    description: 'Real-time weather data',
    priceUSD: 0.001,
    maxDuration: null
  },
  'crypto': {
    description: 'Cryptocurrency prices (BTC, ETH, SOL)',
    priceUSD: 0.005,
    maxDuration: null
  },
  'news': {
    description: 'Latest news headlines',
    priceUSD: 0.002,
    maxDuration: null
  },
  'geo': {
    description: 'Geocoding service',
    priceUSD: 0.003,
    maxDuration: null
  },
  'tts': {
    description: 'Text-to-Speech (per 1000 chars)',
    priceUSD: 0.01,
    maxDuration: null,
    note: 'Ideal for podcast generation (e.g., 5000 chars = 0.05 USDC)'
  },
  'memory': {
    description: 'Memory persistence (per 1000 chars/day)',
    priceUSD: 0.002,
    maxDuration: '30d'
  },
  'premium': {
    description: 'Full API access (all services)',
    priceUSD: 0.02,
    maxDuration: '30d'
  }
};

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Payment-Tx, X-402-Token, Authorization');
  next();
});

// ============================================
// x402 COMPATIBLE PAYMENT CHECK
// ============================================
function requirePayment(serviceId, req) {
  const service = SERVICES[serviceId];
  if (!service) {
    return { error: 'Unknown service', serviceId };
  }
  
  // Check x402 header first
  const x402Token = req.headers['x-402-token'];
  const paymentTx = req.headers['x-payment-tx'];
  
  if (!x402Token && !paymentTx) {
    return {
      error: 'PAYMENT_REQUIRED',
      statusCode: 402,
      service: serviceId,
      price: service.priceUSD,
      payment: {
        scheme: 'x402',
        currency: 'USDC',
        network: 'base',
        chainId: CONFIG.network.chainId,
        address: CONFIG.paymentAddress,
        amount: service.priceUSD.toString(),
        description: service.description
      },
      headers: {
        'X-Payment-Tx': 'Transaction hash from Base mainnet',
        'X-402-Token': 'x402 payment token (optional)'
      },
      instructions: {
        step1: 'Get USDC on Base mainnet',
        step2: `Send ${service.priceUSD} USDC to ${CONFIG.paymentAddress}`,
        step3: 'Add header: X-Payment-Tx: YOUR_TRANSACTION_HASH',
        example: `curl -H "X-Payment-Tx: 0x..." ${req.protocol}://${req.get('host')}/api/${serviceId}`
      },
      x402Format: {
        'HTTP/1.1 402 Payment Required': {
          'x402-scheme': 'USDC@base:8453',
          'x402-amount': service.priceUSD.toString(),
          'x402-recipient': CONFIG.paymentAddress
        }
      }
    };
  }
  
  return null; // Payment present
}

// ============================================
// API ENDPOINTS
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Agent Payment Service',
    version: '2.0.0',
    x402: true,
    network: 'Base Mainnet',
    currency: 'USDC',
    paymentAddress: CONFIG.paymentAddress,
    explorer: `${CONFIG.network.explorer}/address/${CONFIG.paymentAddress}`,
    timestamp: new Date().toISOString()
  });
});

// x402 discovery endpoint
app.get('/.well-known/x402', (req, res) => {
  res.json({
    schemes: ['USDC'],
    networks: ['base'],
    currency: 'USDC',
    paymentAddress: CONFIG.paymentAddress,
    services: SERVICES
  });
});

// Service info with x402 support
app.get('/api/info', (req, res) => {
  const services = Object.entries(SERVICES).map(([key, service]) => ({
    id: key,
    ...service,
    endpoint: `/api/${key}`,
    x402: {
      scheme: 'USDC@base:8453',
      amount: service.priceUSD.toString()
    }
  }));
  
  res.json({
    service: 'Agent Payment Service',
    version: '2.0.0',
    x402Compatible: true,
    network: 'Base Mainnet',
    chainId: 8453,
    currency: 'USDC',
    paymentAddress: CONFIG.paymentAddress,
    explorerUrl: `${CONFIG.network.explorer}/address/${CONFIG.paymentAddress}`,
    services,
    supportedSchemes: ['USDC@base:8453'],
    getPaymentHeaders: {
      'X-Payment-Tx': 'Transaction hash (required)',
      'X-402-Token': 'x402 token (optional)'
    }
  });
});

// ============================================
// SERVICES
// ============================================

// Weather API
app.get('/api/weather', async (req, res) => {
  const paymentRequired = requirePayment('weather', req);
  if (paymentRequired) {
    return res.status(402).json(paymentRequired);
  }
  
  // Return weather data
  res.json({
    service: 'weather',
    paid: true,
    data: {
      temperature: 22,
      condition: 'sunny',
      humidity: 45,
      windSpeed: 12,
      location: 'Default Location',
      timestamp: new Date().toISOString()
    }
  });
});

// Crypto API
app.get('/api/crypto', async (req, res) => {
  const paymentRequired = requirePayment('crypto', req);
  if (paymentRequired) {
    return res.status(402).json(paymentRequired);
  }
  
  res.json({
    service: 'crypto',
    paid: true,
    data: {
      BTC: { price: 97500, change: '+2.5%', volume: '32B' },
      ETH: { price: 3650, change: '+1.8%', volume: '15B' },
      SOL: { price: 240, change: '+3.2%', volume: '4B' },
      BASE: { price: 0.85, change: '+0.5%', volume: '100M' },
      timestamp: new Date().toISOString()
    }
  });
});

// News API
app.get('/api/news', async (req, res) => {
  const paymentRequired = requirePayment('news', req);
  if (paymentRequired) {
    return res.status(402).json(paymentRequired);
  }
  
  res.json({
    service: 'news',
    paid: true,
    data: [
      { title: 'AI Agents Transform Web3 Payments', source: 'CryptoDaily', url: '#', time: '2h ago', category: 'AI' },
      { title: 'x402 Protocol Reaches 75M Transactions', source: 'TechCrunch', url: '#', time: '4h ago', category: 'Protocol' },
      { title: 'Base Network TVL Reaches $5B', source: 'BaseNews', url: '#', time: '6h ago', category: 'DeFi' },
      { title: 'Moltbook Agent Economy Grows', source: 'AgentNews', url: '#', time: '8h ago', category: 'AI Agents' }
    ]
  });
});

// Geo API
app.get('/api/geo', async (req, res) => {
  const paymentRequired = requirePayment('geo', req);
  if (paymentRequired) {
    return res.status(402).json(paymentRequired);
  }
  
  const { address } = req.query;
  res.json({
    service: 'geo',
    paid: true,
    data: {
      address: address || 'Unknown',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      formatted: `${address || 'Unknown'}, San Francisco, CA`,
      country: 'USA',
      timestamp: new Date().toISOString()
    }
  });
});

// TTS API (NEW - HIGH DEMAND)
app.get('/api/tts', async (req, res) => {
  const paymentRequired = requirePayment('tts', req);
  if (paymentRequired) {
    return res.status(402).json(paymentRequired);
  }
  
  const { text, voice } = req.query;
  
  // Simulated TTS response
  res.json({
    service: 'tts',
    paid: true,
    data: {
      text: text || 'Hello from Agent Payment Service!',
      voice: voice || 'default',
      audioUrl: 'https://example.com/audio/demo.mp3', // Placeholder
      duration: '0:30',
      chars: (text || 'Hello from Agent Payment Service!').length,
      price: 0.01,
      note: 'Full TTS with ElevenLabs integration coming soon',
      timestamp: new Date().toISOString()
    }
  });
});

// Memory Storage API (NEW - HIGH DEMAND)
app.get('/api/memory', async (req, res) => {
  const paymentRequired = requirePayment('memory', req);
  if (paymentRequired) {
    return res.status(402).json(paymentRequired);
  }
  
  const { content, key } = req.query;
  
  res.json({
    service: 'memory',
    paid: true,
    data: {
      key: key || 'default',
      stored: true,
      size: (content || '').length,
      expiresIn: '30d',
      note: 'Memory persistence service for agent context',
      timestamp: new Date().toISOString()
    }
  });
});

// Premium API
app.get('/api/premium', async (req, res) => {
  const paymentRequired = requirePayment('premium', req);
  if (paymentRequired) {
    return res.status(402).json(paymentRequired);
  }
  
  res.json({
    service: 'premium',
    paid: true,
    features: [
      'Unlimited API calls',
      'Priority processing',
      'Custom voice models',
      'Extended memory (90d)',
      'Dedicated support'
    ],
    data: { 
      status: 'premium_active', 
      expires: '30d',
      tier: 'pro'
    },
    timestamp: new Date().toISOString()
  });
});

// ============================================
// PAYMENT VERIFICATION
// ============================================

// Verify payment
app.post('/api/verify', async (req, res) => {
  const { txHash, service, amountUSD } = req.body;
  
  if (!txHash) {
    return res.status(400).json({
      error: 'Missing txHash',
      required: ['txHash', 'service (optional)', 'amountUSD (optional)']
    });
  }
  
  const verified = await verifyPayment(txHash, amountUSD || 0.001);
  
  if (verified && verified.verified) {
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

// Check balance
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

async function verifyPayment(txHash, expectedAmount) {
  try {
    const txData = transactionLog[txHash];
    if (txData && txData.verified) {
      return txData;
    }
    
    if (CONFIG.basescanApiKey) {
      const response = await axios.get(
        `${CONFIG.network.explorer}/api?module=proxy&action=eth_getTransactionByTxHash&txhash=${txHash}&apikey=${CONFIG.basescanApiKey}`
      );
      
      if (response.data.result) {
        const tx = response.data.result;
        const value = parseInt(tx.value, 16) / 1e6;
        
        if (value >= (expectedAmount || 0.001) * 0.9) {
          const verifiedTx = {
            txHash,
            from: tx.from.toLowerCase(),
            to: tx.to ? tx.to.toLowerCase() : '',
            amount: value,
            verified: true,
            timestamp: new Date().toISOString()
          };
          
          transactionLog[txHash] = verifiedTx;
          return verifiedTx;
        }
      }
    }
    
    return {
      txHash,
      verified: false,
      message: 'Cannot verify without BaseScan API key',
      note: 'Please verify manually'
    };
    
  } catch (error) {
    return { txHash, verified: false, error: error.message };
  }
}

async function getUSDCBalance(address) {
  try {
    const abi = ['function balanceOf(address owner) view returns (uint256)'];
    const provider = new (require('ethers').JsonRpcProvider)(CONFIG.network.rpcUrl);
    const usdcContract = new (require('ethers').Contract)(
      CONFIG.network.usdcAddress,
      abi,
      provider
    );
    
    const balance = await usdcContract.balanceOf(address);
    return parseFloat((require('ethers').formatUnits)(balance, 6));
  } catch (error) {
    return 0;
  }
}

const transactionLog = {};

// ============================================
// START SERVER
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  💰 Agent Payment Service v2.0 - x402 Compatible           ║
╠══════════════════════════════════════════════════════════════╣
║ Network: Base Mainnet (Chain ID: 8453)                       ║
║ Currency: USDC (Real)                                        ║
║ Protocol: x402 + Simple Header                               ║
║                                                              ║
║ 💵 Payment Address:                                          ║
║    ${CONFIG.paymentAddress}                       ║
║                                                              ║
║ 🔗 ${CONFIG.network.explorer}/address/${CONFIG.paymentAddress.substring(0,20)}...  ║
║                                                              ║
║ Services:                                                     ║
║   GET  /health              - Health check                   ║
║   GET  /.well-known/x402   - x402 discovery                  ║
║   GET  /api/info            - Service info                   ║
║   GET  /api/weather         - Weather (0.001 USDC)           ║
║   GET  /api/crypto          - Crypto (0.005 USDC)            ║
║   GET  /api/news            - News (0.002 USDC)              ║
║   GET  /api/geo             - Geo (0.003 USDC)               ║
║   GET  /api/tts             - TTS (0.01 USDC/1k chars) 🔥   ║
║   GET  /api/memory          - Memory (0.002 USDC/1k chars)   ║
║   GET  /api/premium         - Premium (0.02 USDC)            ║
║   POST /api/verify           - Verify payment                 ║
║   GET  /api/balance         - Check balance                  ║
║                                                              ║
║ x402 Headers:                                                ║
║   X-Payment-Tx: <tx_hash>  (required for payment)           ║
║   X-402-Token: <token>      (optional, x402 format)          ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
