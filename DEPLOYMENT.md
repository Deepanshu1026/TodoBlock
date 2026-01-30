# 🚀 Free Deployment Guide (Sepolia Testnet)

This guide will help you deploy your **TodoBlock** app to the **Sepolia Testnet** (a public blockchain network that works just like the real one but with free currency) and host the frontend on **Netlify** for free.

---

## Part 1: Smart Contract Deployment (Blockchain)

### 1. Get Free "Testnet" Ethereum
You need fake money to pay for the transaction fees (Gas).
1.  Go to **[Google Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)** or **[Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)**.
2.  Login and paste your MetaMask wallet address.
3.  Click **Send Me ETH**. You should see it in your MetaMask (switch network to *Sepolia*).

### 2. Get an RPC URL (Connection to Blockchain)
You need a "node" to talk to the blockchain.
1.  Sign up for a free account at **[Alchemy.com](https://www.alchemy.com/)**.
2.  Create a new App -> Choose **Ethereum** -> Choose **Sepolia**.
3.  Click "API Key" and copy the **HTTPS URL**.

### 3. Secure Your Secrets
**IMPORTANT:** Never share your private key.
1.  Install `dotenv` to manage secrets securely:
    ```bash
    npm install dotenv --save-dev
    ```
2.  Create a file named `.env` in your project root:
    ```
    SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY"
    PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY"
    ```
    *(To get your Private Key: Open MetaMask -> Three dots -> Account Details -> Show Private Key)*

### 4. Configure Hardhat
Update `hardhat.config.js` to use these values:
```javascript
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

### 5. Deploy!
Run this command in your terminal:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
If successful, it will print: `Todo deployed to: 0x123...` **Copy this address!**

---

## Part 2: Frontend Deployment (Hosting)

### 1. Update the Code
1.  Open `frontend/app.js`.
2.  Replace `CONTRACT_ADDRESS` with the new address you got in Part 1.
    ```javascript
    const CONTRACT_ADDRESS = "0xYourNewSepoliaAddress...";
    ```
3.  (Optional) Update `frontend/index.html` title or texts if you want.

### 2. Host for Free (Netlify Drop)
1.  Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2.  Locate your `frontend` folder on your computer.
3.  **Drag and drop** the `frontend` folder onto the Netlify page.
4.  Wait a few seconds, and it will give you a public URL (e.g., `https://random-name.netlify.app`).

### 3. Final Test
1.  Open your new Netlify link.
2.  Connect MetaMask (ensure you are on **Sepolia** network).
3.  Add a task. You will see a real MetaMask transaction popup.
4.  Confirm it and wait (it takes 10-15 seconds on Sepolia).

---

**🎉 Congratulations! Your DApp is now live on the decentralized web.**
