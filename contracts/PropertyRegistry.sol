
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./ValidatorConsensus.sol";
import "./FractionToken.sol";
import "./NFTMapping.sol";

contract PropertyRegistry {
    struct Property {
        uint256 id;
        string name;
        string ipfsHash;
        string coordinates;
        address owner;
        bool registered;
        address fractionToken;
        uint256 nftId;
    }
    uint256 public propertyCount;
    mapping(uint256 => Property) public properties;
    ValidatorConsensus public validator;
    NFTMapping public nftMapping;
    event PropertySubmitted(uint256 propertyId, address owner);
    event PropertyRegistered(uint256 propertyId, address owner, address fractionToken, uint256 nftId);

    constructor(address _validator, address _nftMapping) {
        validator = ValidatorConsensus(_validator);
        nftMapping = NFTMapping(_nftMapping);
    }

    function submitProperty(string memory name, string memory ipfsHash, string memory coordinates) external {
        propertyCount++;
        properties[propertyCount] = Property({id: propertyCount, name: name, ipfsHash: ipfsHash, coordinates: coordinates, owner: msg.sender, registered: false, fractionToken: address(0), nftId: 0});
        emit PropertySubmitted(propertyCount, msg.sender);
    }

    function registerProperty(uint256 propertyId) external {
        Property storage prop = properties[propertyId];
        require(msg.sender == prop.owner, "Only owner can register");
        require(!prop.registered, "Already registered");
        require(validator.isPropertyApproved(propertyId), "Not approved");
        FractionToken token = new FractionToken(prop.name, "FRACT", 1000, prop.owner);
        prop.fractionToken = address(token);
        uint256 nftId = nftMapping.mintNFT(propertyId, prop.ipfsHash, prop.fractionToken, prop.coordinates, prop.owner);
        prop.nftId = nftId;
        prop.registered = true;
        emit PropertyRegistered(propertyId, prop.owner, address(token), nftId);
    }
}
