const { ethers } = require("hardhat");

async function main() {
    const address = "0xCa24B9A11D485623549722cA6683D90466F84b20";
    console.log(`Checking code at ${address}...`);
    const code = await ethers.provider.getCode(address);
    console.log("Code length:", code.length);
    if (code === "0x") {
        console.log("No contract found at this address on this network.");
    } else {
        console.log("Contract found!");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
