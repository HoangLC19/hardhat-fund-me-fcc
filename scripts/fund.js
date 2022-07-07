const { EtherscanProvider } = require("@ethersproject/providers")
const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    await deployments.fixture(["all"])
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("Funding Contract...")
    const transactionResponse = await fundMe.fund({
        value: ethers.utils.parseEther("0.05"),
    })
    await transactionResponse.wait(1)
    console.log("Funded!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
