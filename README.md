# LinkTask - Decentralized Todo App

LinkTask is a modern, decentralized task management application built on the Ethereum blockchain. It allows users to create, manage, update, and delete tasks with full data ownership and transparency. The application connects directly to your crypto wallet (MetaMask) and stores all tasks on-chain.

## 🚀 Features

- **Decentralized Storage**: All tasks are stored on the Ethereum blockchain (Smart Contract).
- **CRUD Operations**:
  - **Create**: Add new tasks.
  - **Read**: View all tasks, filtered by status (Active/Completed).
  - **Update**: Edit task details and toggle completion status.
  - **Delete**: Soft delete tasks (removes them from view while keeping history).
- **Modern UI/UX**:
  - Clean, minimalist interface designed with vanilla CSS.
  - Real-time status updates (Loading spinners, optimisic UI).
  - "Active" and "Completed" filters.
- **Wallet Connection**: Seamless integration with MetaMask.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Ethers.js
- **Backend / Smart Contract**: Solidity (v0.8.20)
- **Development Environment**: Hardhat

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MetaMask](https://metamask.io/) browser extension installed

## 🔧 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/LinkTask.git
    cd LinkTask
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start Local Hardhat Node**
    This ensures you have a local blockchain running.
    ```bash
    npx hardhat node
    ```

4.  **Deploy the Smart Contract**
    Open a *new terminal* (keep the node running) and deploy the contract to your local network.
    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```
    *Note the address where the contract is deployed (e.g., `0xa513...`).*

5.  **Configure Frontend**
    - Open `frontend/app.js`.
    - Find the `CONTRACT_ADDRESS` constant at the top.
    - Replace it with the address from the deployment step above.
    ```javascript
    const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
    ```

6.  **Run the Application**
    - You can simply open `frontend/index.html` in your browser.
    - For a better experience, use a live server (like VS Code Live Server Extension).

## 🦊 Connecting MetaMask

1.  Open MetaMask and switch the network to **Localhost 8545**.
    - RPC URL: `http://127.0.0.1:8545/`
    - Chain ID: `31337` (default for Hardhat)
    - Currency Symbol: `ETH`
2.  Import one of the generated accounts from the `npx hardhat node` terminal using its **Private Key** to have test funds.
3.  Refresh the page and connect!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
