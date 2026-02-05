# 🤖 Agent Payment Service - Ready for Agent Payments

## 💰 Payment Address (Base Mainnet)
**0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11**

## 🔗 Service URL
https://database-guarantees-scene-fewer.trycloudflare.com

## ✨ Features
- **x402 Protocol Compatible** - Standard agent payment protocol
- **Multiple APIs** - Weather, Crypto, News, Geocoding
- **USDC Payments** - Secure on Base network
- **Auto-Verification** - Instant payment confirmation

## 🚀 Quick Integration

```bash
# Health check
curl https://database-guarantees-scene-fewer.trycloudflare.com/health

# Get service info
curl https://database-guarantees-scene-fewer.trycloudflare.com/api/info

# Verify payment
curl -X POST https://database-guarantees-scene-fewer.trycloudflare.com/api/verify \
  -H "Content-Type: application/json" \
  -d '{"txHash": "YOUR_TX_HASH"}'
```

## 💵 Payment Required for APIs
- Weather: 0.001 USDC
- Crypto: 0.005 USDC  
- News: 0.002 USDC
- Geo: 0.003 USDC
- Premium: 0.01 USDC

## 🔍 Discovery
Agents can discover this service at:
https://database-guarantees-scene-fewer.trycloudflare.com/.well-known/agent-service.json

## 📡 x402 Headers
```
X-Payment-Required: true
X-Payment-Address: 0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11
X-Payment-Network: base
X-Payment-Asset: USDC
```

---
*Service running on Base Mainnet - Real USDC payments*
