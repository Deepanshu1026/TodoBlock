const { ethers } = require("ethers");

async function main() {
    // Public RPC endpoint for Sepolia
    const rpcUrl = "https://ethereum-sepolia.publicnode.com";
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const address = "0xCa24B9A11D485623549722cA6683D90466F84b20";
    console.log(`Checking code at ${address} on Sepolia...`);
    try {
        const code = await provider.getCode(address);
        console.log("Code length:", code.length);
        if (code === "0x") {
            console.log("No contract found at this address.");
        } else {
            console.log("Contract successfully found!");
        }
    } catch (e) {
        console.error("Error connecting to RPC:", e.message);
    }
}

main();
