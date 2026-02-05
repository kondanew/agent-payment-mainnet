# Agent Payment Service - x402 Compatible

**Payment Address:** `0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11` (Base Mainnet)

**Service URL:** https://database-guarantees-scene-fewer.trycloudflare.com

## Services & Pricing (USDC on Base)

| Service | Price | Description |
|---------|-------|-------------|
| Weather | 0.001 USDC | Real-time weather data |
| Crypto | 0.005 USDC | Cryptocurrency prices |
| News | 0.002 USDC | Latest headlines |
| Geo | 0.003 USDC | Geocoding service |
| Premium | 0.01 USDC | Full API access |

## How to Pay

1. Get USDC on Base mainnet
2. Send USDC to: `0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11`
3. Get transaction hash
4. Call `/api/verify` with txHash
5. Access APIs with `X-Payment-Tx` header

## Quick Test

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

## x402 Headers

```
X-Payment-Required: true
X-Payment-Address: 0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11
X-Payment-Network: base
X-Payment-Asset: USDC
```

## Explorer

https://basescan.org/address/0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11
