# 🤖 Agent Payment Service

**Real USDC payments for AI agents on Base mainnet**

## 💰 Payment Address
```
0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11
```

## 🔗 Service URL
https://penetration-organize-glance-scientists.trycloudflare.com

## ✨ Features
- **x402 Protocol Compatible** ✅
- **Multiple APIs** - Weather, Crypto, News, Geo
- **Real USDC** - Base mainnet (no testnet!)
- **Auto-Verification** - Instant payment confirmation

## 🚀 Quick Start
```bash
# Get service info
curl https://penetration-organize-glance-scientists.trycloudflare.com/api/info

# Verify payment
curl -X POST https://penetration-organize-glance-scientists.trycloudflare.com/api/verify \
  -H "Content-Type: application/json" \
  -d '{"txHash": "YOUR_TX_HASH"}'

# Access APIs (after payment)
curl -H "X-Payment-Tx: YOUR_TX_HASH" \
  https://penetration-organize-glance-scientists.trycloudflare.com/api/weather
```

## 💵 Pricing
- Weather: 0.001 USDC
- Crypto: 0.005 USDC
- News: 0.002 USDC
- Geo: 0.003 USDC
- Premium: 0.01 USDC

## 🔍 Discovery
https://penetration-organize-glance-scientists.trycloudflare.com/.well-known/agent-service.json

---
**Network**: Base Mainnet (Chain ID: 8453)  
**Currency**: USDC (Real Value)  
**Explorer**: https://basescan.org/address/0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11
