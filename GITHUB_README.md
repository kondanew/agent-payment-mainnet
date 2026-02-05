# 🤖 Agent Payment Service

**Real USDC payments for AI agents on Base mainnet**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 💰 Payment Address

```
0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11
```

**Network:** Base Mainnet (Chain ID: 8453)  
**Currency:** USDC (Real Value - Not Testnet!)  
**Explorer:** [View on BaseScan](https://basescan.org/address/0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11)

## 🔗 Service URL

https://penetration-organize-glance-scientists.trycloudflare.com

## ✨ Features

- ✅ **x402 Protocol Compatible** - Industry standard for agent payments
- ✅ **Real USDC** - Base mainnet (no testnet tokens!)
- ✅ **Multiple APIs** - Weather, Crypto, News, Geocoding
- ✅ **Auto-Verification** - Instant payment confirmation
- ✅ **Agent-Discoverable** - Built-in service discovery
- ✅ **Micro-Payments** - Pay-per-use pricing

## 🚀 Quick Start

### Get Service Info
```bash
curl https://penetration-organize-glance-scientists.trycloudflare.com/api/info
```

### Make a Payment
1. Get USDC on Base mainnet
2. Send USDC to: `0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11`
3. Get your transaction hash
4. Verify payment:
```bash
curl -X POST https://penetration-organize-glance-scientists.trycloudflare.com/api/verify \
  -H "Content-Type: application/json" \
  -d '{"txHash": "YOUR_TRANSACTION_HASH"}'
```

### Access Paid APIs
```bash
# With payment verified, access APIs:
curl -H "X-Payment-Tx: YOUR_TX_HASH" \
  https://penetration-organize-glance-scientists.trycloudflare.com/api/weather
```

## 💵 Pricing

| Service | Price (USDC) | Description |
|---------|-------------|-------------|
| Weather | 0.001 | Real-time weather data |
| Crypto | 0.005 | Cryptocurrency prices |
| News | 0.002 | Latest news headlines |
| Geo | 0.003 | Geocoding service |
| Premium | 0.01 | Full API access |

## 🔍 Agent Discovery

Agents can discover this service at:
```
https://penetration-organize-glance-scientists.trycloudflare.com/.well-known/agent-service.json
```

**Example discovery response:**
```json
{
  "service": "agent-payment-service",
  "url": "https://penetration-organize-glance-scientists.trycloudflare.com",
  "paymentAddress": "0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11",
  "network": "base",
  "asset": "USDC"
}
```

## 🔧 API Reference

### GET /health
Service health check.

### GET /api/info
Get service information and pricing.

### GET /api/{service}
Access paid APIs. Requires `X-Payment-Tx` header with verified transaction hash.

### POST /api/verify
Verify a payment transaction.
```json
{
  "txHash": "0x...",
  "service": "weather",
  "amountUSD": 0.001
}
```

### GET /api/balance
Check current USDC balance of payment address.

## 🤝 For Agent Developers

### Integration Example
```javascript
const SERVICE_URL = 'https://penetration-organize-glance-scientists.trycloudflare.com';

// 1. Get payment info
const info = await fetch(`${SERVICE_URL}/api/info`);

// 2. Make payment to address
// 3. Verify payment
await fetch(`${SERVICE_URL}/api/verify`, {
  method: 'POST',
  body: JSON.stringify({ txHash: 'YOUR_TX_HASH' })
});

// 4. Use services
const weather = await fetch(`${SERVICE_URL}/api/weather?city=London`, {
  headers: { 'X-Payment-Tx': 'YOUR_TX_HASH' }
});
```

### x402 Headers
```http
X-Payment-Required: true
X-Payment-Address: 0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11
X-Payment-Network: base
X-Payment-Asset: USDC
```

## 📁 Project Structure

```
agent-payment-mainnet/
├── server.js           # Main application
├── package.json        # Dependencies
├── README.md          # This file
├── PROMOTION.md       # Marketing copy
└── .well-known/
    └── agent-service.json  # Service discovery
```

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Agent     │────▶│ Payment Svc  │────▶│  Base Network  │
│             │     │  (Express)   │     │  (USDC)         │
└─────────────┘     └──────────────┘     └─────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │  Payment Flow  │
                 │  • Receive     │
                 │  • Verify      │
                 │  • Grant Access│
                 └────────────────┘
```

## 🔒 Security Notes

- Always verify payments on-chain before granting access
- Use BaseScan for transaction verification: https://basescan.org
- Payment address is immutable once deployed

## 📜 License

MIT License - Free for agent use

## 💬 Contact

- Open issues for bugs or features
- Discussions for questions or integrations

---

**Built for the agent economy!** 🚀

