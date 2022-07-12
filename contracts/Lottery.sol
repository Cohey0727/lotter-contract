// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract LotteryManager {
    address[] public deployedLotteries;

    function createLottery(uint256 minimum) public {
        Lottery newLottery = new Lottery(minimum, msg.sender);
        deployedLotteries.push(address(newLottery));
    }

    function getDeployedLottery() public view returns (address[] memory) {
        return deployedLotteries;
    }
}

struct Request {
    string id;
    uint256 value;
    string description;
    address recipient;
    bool completed;
    uint256 approvalCount;
    mapping(address => bool) approvals;
    bool initialized;
}

struct Contribution {
    uint256 value;
    uint256 timestamp;
}

contract Lottery {
    address public factory;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => Contribution) public contributions;
    uint256 contributionCount;
    mapping(string => Request) public requests;

    modifier onlyManager() {
        require(manager == msg.sender);
        _;
    }

    modifier onlyContributer() {
        Contribution memory contribution = contributions[msg.sender];
        bool isContributer = contribution.value != 0 &&
            contribution.timestamp != 0;
        require(isContributer);
        _;
    }

    modifier mustBeInitialized(string memory requestId) {
        Request storage request = requests[requestId];
        require(request.initialized);
        _;
    }

    constructor(uint256 minimum, address creator) {
        factory = msg.sender;
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        contributions[msg.sender] = Contribution({
            value: msg.value,
            timestamp: block.timestamp
        });
        contributionCount++;
    }

    function createRequest(
        string memory requestId,
        string memory description,
        uint256 value,
        address recipient
    ) public onlyManager {
        Request storage newRequest = requests[requestId];
        // must be unique requestId.
        require(!newRequest.initialized);

        newRequest.id = requestId;
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.completed = false;
        newRequest.initialized = true;
        newRequest.approvalCount = 0;
    }

    function approvalRequest(string memory requestId)
        public
        onlyContributer
        mustBeInitialized(requestId)
    {
        Request storage request = requests[requestId];

        // must be not approved
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function disapprovalRequest(string memory requestId)
        public
        onlyContributer
        mustBeInitialized(requestId)
    {
        Request storage request = requests[requestId];

        // must be approved
        require(request.approvals[msg.sender]);

        request.approvals[msg.sender] = false;
        request.approvalCount--;
    }

    function finalizeRequest(string memory requestId) public onlyManager {
        Request storage request = requests[requestId];
        // must be initialized
        require(request.initialized);
        // must be not completed
        require(!request.completed);

        // 50% of contributers must approve the request
        require(contributionCount / 2 == request.approvalCount);
        request.completed = true;
    }
}
