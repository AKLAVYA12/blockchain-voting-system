
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    address public admin;
    bool public votingOpen = true;
    uint256 public candidateCount;

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VotingClosed();

    constructor(string[] memory candidateNames) {
        require(candidateNames.length >= 2, "At least two candidates required");

        admin = msg.sender;

        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidateCount++;

            candidates[candidateCount] = Candidate({
                id: candidateCount,
                name: candidateNames[i],
                voteCount: 0
            });
        }
    }

    function vote(uint256 candidateId) external {
        require(votingOpen, "Voting is closed");
        require(!hasVoted[msg.sender], "You have already voted");
        require(
            candidateId > 0 && candidateId <= candidateCount,
            "Invalid candidate"
        );

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;

        emit VoteCast(msg.sender, candidateId);
    }

    function closeVoting() external {
        require(msg.sender == admin, "Only admin can close voting");
        require(votingOpen, "Voting is already closed");

        votingOpen = false;
        emit VotingClosed();
    }

    function getCandidate(uint256 candidateId)
        external
        view
        returns (uint256 id, string memory name, uint256 voteCount)
    {
        require(
            candidateId > 0 && candidateId <= candidateCount,
            "Invalid candidate"
        );

        Candidate memory candidate = candidates[candidateId];

        return (
            candidate.id,
            candidate.name,
            candidate.voteCount
        );
    }
}
