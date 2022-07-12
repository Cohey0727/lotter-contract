// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract LotteryFactory {
  address[] public lotteries;

  function createLottery(string memory title, uint256 unitPrice) public {
    Lottery newLottery = new Lottery(msg.sender, title, unitPrice);
    lotteries.push(address(newLottery));
  }

  function getDeployedLottery() public view returns (address[] memory) {
    return lotteries;
  }
}

enum LotteryStatus {
  Initial,
  Active,
  Finished
}

contract Lottery {
  address public factory;
  address public manager;
  string public title;
  uint256 public unitPrice;
  LotteryStatus public status;
  mapping(address => uint256) public fixedShares;
  mapping(string => uint256) public prizeShares;

  address[] public tickets;
  mapping(address => uint256[]) public ticketsByAddress;

  constructor(
    address creator,
    string memory _title,
    uint256 _unitPrice
  ) {
    factory = msg.sender;
    manager = creator;
    title = _title;
    unitPrice = _unitPrice;
  }

  modifier onlyManager() {
    require(manager == msg.sender);
    _;
  }

  modifier onlyActive() {
    require(status == LotteryStatus.Active);
    _;
  }
  modifier onlyInitial() {
    require(status == LotteryStatus.Initial);
    _;
  }

  function addFixedShares(address to, uint256 shareRate) public onlyInitial {
    fixedShares[to] = shareRate;
  }

  function removeFixedShares(address to) public onlyInitial {
    fixedShares[to] = 0;
  }

  function addPrizeShares(string memory prize, uint256 shareRate) public onlyInitial {
    prizeShares[prize] = shareRate;
  }

  function removePrizeShares(string memory prize) public onlyInitial {
    prizeShares[prize] = 0;
  }

  function activation() public onlyManager onlyInitial {
    status = LotteryStatus.Active;
  }

  function finish() public onlyManager onlyActive {
    status = LotteryStatus.Finished;
  }

  function buyTicket() public payable onlyActive {
    require(msg.value == unitPrice);
    tickets.push(msg.sender);
    uint256 ticketId = tickets.length;
    ticketsByAddress[msg.sender].push(ticketId);
  }

  function buyTickets(uint256 units) public payable onlyActive {
    require(msg.value == unitPrice * units);
    uint256 ticketId = tickets.length;
    for (uint256 i = 0; i < units; i++) {
      tickets.push(msg.sender);
      ticketsByAddress[msg.sender].push(ticketId);
      ticketId = ticketId + 1;
    }
  }
}
