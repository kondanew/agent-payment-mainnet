#!/bin/bash
# Push to GitHub script

cd /root/.openclaw/workspace/agent-payment-mainnet

echo "📦 Pushing to GitHub..."
echo ""
echo "1. Create a new GitHub repository at https://github.com/new"
echo ""
echo "2. Push existing repository:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Or use GitHub CLI:"
echo "   gh repo create agent-payment-mainnet --public --push"
echo ""
echo "📖 GitHub CLI: https://cli.github.com"
echo "📖 Create repo: https://github.com/new"
