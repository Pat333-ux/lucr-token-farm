// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract LUCRFarm {
    struct Stake {
        address farmer;
        uint256 amount;
        uint256 lockUntil;
        bool active;
    }

    mapping(address => Stake) private stakes;
    mapping(address => uint256) public rewards;

    uint256 public totalStaked;
    address public owner;

    event Staked(address indexed farmer, uint256 amount, uint256 lockUntil);
    event Withdrawn(address indexed farmer, uint256 amount);
    event Harvested(address indexed farmer, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function stake(uint256 amount, uint256 lockDays) external payable {
        require(amount > 0, "amount must be > 0");

        uint256 lockUntil = block.timestamp + (lockDays * 1 days);

        stakes[msg.sender] = Stake({
            farmer: msg.sender,
            amount: amount,
            lockUntil: lockUntil,
            active: true
        });

        totalStaked += amount;

        emit Staked(msg.sender, amount, lockUntil);
    }

    function withdraw() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.active, "no active stake");

        uint256 amount = userStake.amount;
        totalStaked -= amount;

        delete stakes[msg.sender];

        emit Withdrawn(msg.sender, amount);
    }

    function harvest() external returns (uint256) {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "no rewards available");

        rewards[msg.sender] = 0;

        emit Harvested(msg.sender, reward);

        return reward;
    }

    function setReward(address farmer, uint256 amount) external onlyOwner {
        rewards[farmer] += amount;
    }
}
