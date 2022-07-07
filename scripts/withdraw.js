// const { getNamedAccounts, ethers } = require("hardhat")

// async function main() {
//     const { deployer } = await getNamedAccounts()
//     const fundMe = await ethers.getContract("FundMe", deployer)
//     console.log("Funding Contract...")
//     const transactionResponse = await fundMe.withdraw()
//     await transactionResponse.wait(1)
//     console.log("Got it back")
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })

const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"])
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log(`Got contract FundMe at ${fundMe.address}`)
    console.log("Withdrawing from contract...")
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait()
    console.log("Got it back!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
