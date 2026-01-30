const { ethers } = require("hardhat");

async function main() {
  const Todo = await ethers.getContractFactory("Todo");
  const todo = await Todo.deploy();

  await todo.deployed();

  console.log("Todo deployed to:", todo.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
