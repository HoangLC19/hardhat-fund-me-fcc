//SPDX-Lincense-Identifier: MIT
//pragma
pragma solidity ^0.8.15;
//Imports
import "./PriceConverter.sol";
//Error Codes
error FundMe__NotOwner();

//Interfaces, Libraries, and Contracts

/// @title A contract for crowd funding
/// @author HoangLC
/// @notice This contract is to demo a sample funding contract
/// @dev This implements price feeds as the library

contract FundMe {
    //Type declarations
    using PriceConverter for uint256;
    //State variables
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address private immutable i_owner;
    address[] private funders;
    mapping(address => uint256) private addressToAmountFunded;
    AggregatorV3Interface private priceFeed;
    //Events, Modifiers
    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Only owner can call this function");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //What happen if a person send ETH to the contract but not call the fund function
    // receive(), fallback()
    // receive() external payable {
    //     fund();
    // }

    // fallback() external payable {
    //     fund();
    // }

    /// @notice This function funds this contract
    /// @dev This implements price feeds as the library
    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "The fund must larger or equal to 50 USD"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner returns (bool) {
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }
        // reset the array
        funders = new address[](0);
        //withdraw the funds
        (bool success, ) = payable(i_owner).call{value: address(this).balance}(
            ""
        );
        return success;
    }

    function cheaperWithdraw() public onlyOwner returns (bool) {
        address[] memory funders_ = funders;
        for (uint256 funderIndex; funderIndex < funders_.length; ) {
            address funder = funders_[funderIndex];
            addressToAmountFunded[funder] = 0;
            unchecked {
                funderIndex++;
            }
        }
        funders = new address[](0);
        (bool success, ) = payable(i_owner).call{value: address(this).balance}(
            ""
        );
        return success;
    }

    function getOwner() external view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) external view returns (address) {
        return funders[index];
    }

    function getAddresstToAmountFunded(address funder)
        external
        view
        returns (uint256)
    {
        return addressToAmountFunded[funder];
    }

    function getPriceFeed() external view returns (AggregatorV3Interface) {
        return priceFeed;
    }
}
