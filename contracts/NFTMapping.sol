// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMapping is ERC721 {
    struct PropertyMeta {
        uint256 propertyId;
        string ipfsHash;
        address fractionToken;
        string coordinates;
    }

    mapping(uint256 => PropertyMeta) public propertyMeta;

    uint256 public tokenCount;

    constructor() ERC721("PropertyNFT", "PNFT") {}

    function mintNFT(uint256 propertyId, string memory ipfsHash, address fractionToken, string memory coordinates, address owner) external returns (uint256) {
        tokenCount++;
        _mint(owner, tokenCount);

        propertyMeta[tokenCount] = PropertyMeta({
            propertyId: propertyId,
            ipfsHash: ipfsHash,
            fractionToken: fractionToken,
            coordinates: coordinates
        });

        return tokenCount;
    }
}
