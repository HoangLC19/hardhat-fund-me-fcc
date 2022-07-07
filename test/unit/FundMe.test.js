const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { expect } = require("chai")
const { developmentChain } = require("../../helper_hardhat_config")

!developmentChain.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe
          let deployer
          let MockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              //deploy fundme contract using hardhat-deploy
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("contructor", async () => {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  expect(response).to.equal(MockV3Aggregator.address)
              })
          })

          describe("fund", async () => {
              it("Should fail if you don't send enough ether", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "The fund must larger or equal to 50 USD"
                  )
              })
              it("updated the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddresstToAmountFunded(
                      deployer
                  )
                  expect(response.toString()).to.equal(response.toString())
              })
              it("Add new funder to the funders array", async () => {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  expect(funder).to.equal(deployer)
              })
          })

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraw ETH from a single funder", async () => {
                  //Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Expect
                  expect(endingFundMeBalance).to.equal(0)
                  expect(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  ).to.equal(endingDeployerBalance.add(gasCost).toString())
              })
              it("withdraw ETH from multiple funders", async () => {
                  //Arange
                  const accounts = await ethers.getSigners()
                  for (let i = 0; i < 6; ++i) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Expect
                  expect(endingFundMeBalance).to.equal(0)
                  expect(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  ).to.equal(endingDeployerBalance.add(gasCost).toString())
              })
              it("Only owner can withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  await expect(fundMeConnectedContract.withdraw()).to.be
                      .reverted
              })
          })

          describe("cheaperWithdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraw ETH from a single funder", async () => {
                  //Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Expect
                  expect(endingFundMeBalance).to.equal(0)
                  expect(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  ).to.equal(endingDeployerBalance.add(gasCost).toString())
              })
              it("withdraw ETH from multiple funders", async () => {
                  //Arange
                  const accounts = await ethers.getSigners()
                  for (let i = 0; i < 6; ++i) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //Expect
                  expect(endingFundMeBalance).to.equal(0)
                  expect(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  ).to.equal(endingDeployerBalance.add(gasCost).toString())
              })
              it("Only owner can withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[1]
                  )
                  await expect(fundMeConnectedContract.cheaperWithdraw()).to.be
                      .reverted
              })
          })
      })
