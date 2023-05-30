import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  /* these two lines deploy the contract to the network */
  const Blog = await ethers.getContractFactory("Blog");
  const blog = await Blog.deploy("My blog");

  await blog.deployed();
  console.log("Blog deployed to: ", blog.address);

  /* this code writes the contract addresses to a local */
  /* file named config.js that we can use in the app */
  fs.writeFileSync(
    "./config.js",
    `
  export const contractAddress = "${blog.address}"
  export const ownerAddress = "${await blog.signer.getAddress()}"
  `
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
