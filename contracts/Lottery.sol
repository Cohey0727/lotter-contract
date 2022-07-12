// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract LotteryFactory {
  address[] public lotteries;

  function createLottery(string memory title, uint256 unitPrice) public {
    Lottery newLottery = new Lottery(msg.sender, title, unitPrice);
    lotteries.push(address(newLottery));
  }

  function getLotteries() public view returns (address[] memory) {
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
  mapping(address => uint256) public donationRates;
  address[] public donationAddresses;

  mapping(string => uint256) public winnerPrizeRates;
  string[] public winnerPrizes;

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

  function getDonationRates() public view returns (address[] memory, uint256[] memory) {
    uint256[] memory rates = new uint256[](donationAddresses.length);
    for (uint256 i = 0; i < donationAddresses.length; i++) {
      rates[i] = donationRates[donationAddresses[i]];
    }
    return (donationAddresses, rates);
  }

  function getWinnerPrizeRates() public view returns (string[] memory, uint256[] memory) {
    uint256[] memory rates = new uint256[](winnerPrizes.length);
    for (uint256 i = 0; i < winnerPrizes.length; i++) {
      rates[i] = winnerPrizeRates[winnerPrizes[i]];
    }
    return (winnerPrizes, rates);
  }

  function getTicketsByAddress(address user) public view returns (uint256[] memory) {
    return ticketsByAddress[user];
  }

  function addDonation(address to, uint256 rate) public onlyInitial {
    donationRates[to] = rate;
    donationAddresses.push(to);
  }

  function removeDonation(address to) public onlyInitial {
    donationRates[to] = 0;
    address[] memory newDonationAddresses = new address[](donationAddresses.length - 1);
    uint256 innerIndex = 0;
    for (uint256 index = 0; index < donationAddresses.length; index++) {
      if (donationAddresses[index] != to) {
        newDonationAddresses[innerIndex] = donationAddresses[index];
        innerIndex++;
      }
    }
    donationAddresses = newDonationAddresses;
  }

  function addWinnerPrize(string memory prizeTitle, uint256 rate) public onlyInitial {
    winnerPrizeRates[prizeTitle] = rate;
    winnerPrizes.push(prizeTitle);
  }

  function removeWinnerPrize(string memory prize) public onlyInitial {
    winnerPrizeRates[prize] = 0;
  }

  function activation() public onlyManager onlyInitial {
    status = LotteryStatus.Active;
  }

  function finish() public onlyManager onlyActive {
    status = LotteryStatus.Finished;
  }

  function buyTicket() public payable onlyActive {
    require(msg.value == unitPrice);
    uint256 ticketId = tickets.length + 1;
    tickets.push(msg.sender);
    ticketsByAddress[msg.sender].push(ticketId);
  }
}
