const { network } = require("hardhat")
const { DECIMALS, INITITAL_ANSWER } = require("../helper_hardhat_config")
module.exports = async ({ getNamedAccount, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITITAL_ANSWER],
        })
        log("Mocks deployed!")
        log("----------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
