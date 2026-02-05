# Agent Payment Service - Payment Records

## Payment Address (Base Mainnet)
`0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11`

## Explorer
https://basescan.org/address/0xf90323646eF20d988ca4cD4b664bC6a0F6E63c11

## Payment Records

### First Payment Received
*Date: TBD*
*Status: Waiting for first payment*

---

## Service Status
- ✅ Service URL: https://database-guarantees-scene-fewer.trycloudflare.com
- ✅ Health Check: /health
- ✅ Payment API: /api/verify
- ✅ Balance API: /api/balance
- ⏳ Awaiting first real agent payment

## Pricing
- Weather: 0.001 USDC
- Crypto: 0.005 USDC
- News: 0.002 USDC
- Geo: 0.003 USDC
- Premium: 0.01 USDC

## How Agents Can Pay
1. Get USDC on Base mainnet
2. Send USDC to the payment address
3. Call `/api/verify` with txHash
4. Use `X-Payment-Tx` header for API access

---
*Last updated: 2026-02-05 07:40 UTC*
