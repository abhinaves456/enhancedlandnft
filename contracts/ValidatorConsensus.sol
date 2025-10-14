
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ValidatorConsensus {
    address[] public validators;
    mapping(address => bool) public isValidator;
    struct PropertyVote {
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) voted;
    }
    mapping(uint256 => PropertyVote) public propertyVotes;
    uint256 public voteThreshold;

    constructor(address[] memory _validators, uint256 _voteThreshold) {
        validators = _validators;
        voteThreshold = _voteThreshold;
        for (uint i = 0; i < validators.length; i++) {
            isValidator[validators[i]] = true;
        }
    }

    function vote(uint256 propertyId, bool approve) external {
        require(isValidator[msg.sender], "Not validator");
        PropertyVote storage pv = propertyVotes[propertyId];
        require(!pv.voted[msg.sender], "Already voted");
        pv.voted[msg.sender] = true;
        if (approve) pv.yesVotes++;
        else pv.noVotes++;
    }

    function isPropertyApproved(uint256 propertyId) external view returns (bool) {
        PropertyVote storage pv = propertyVotes[propertyId];
        uint256 yesPercent = (pv.yesVotes * 100) / validators.length;
        return yesPercent >= voteThreshold;
    }
}
