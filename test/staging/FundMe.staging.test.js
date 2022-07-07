const { ethers, getNamedAccounts, network } = require("hardhat")
const { expect } = require("chai")
const { developmentChain } = require("../../helper_hardhat_config")

developmentChain.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseEther("0.1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })
          it("Allow people to fund and withdraw", async () => {
              await fundMe.fund({ value: sendValue })
              const transactionResponse = await fundMe.withdraw()
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              expect(endingBalance.toString()).to.equal("0")
          })
      })
