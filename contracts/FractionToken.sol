
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FractionToken is ERC20 {
    address public propertyOwner;
    constructor(string memory name, string memory symbol, uint256 totalSupply, address _owner) ERC20(name, symbol) {
        _mint(_owner, totalSupply * (10 ** decimals()));
        propertyOwner = _owner;
    }
}
