require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: (process.env.SEPOLIA_RPC_URL && process.env.SEPOLIA_RPC_URL.length > 0)
        ? process.env.SEPOLIA_RPC_URL
        : "https://ethereum-sepolia.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
