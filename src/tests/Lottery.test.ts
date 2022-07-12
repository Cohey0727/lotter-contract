// contract test code will go here
import assert from "assert";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import compileResult from "../compile";

const ganache = require("ganache-cli");
const gas = 10000000;
const web3 = new Web3(ganache.provider({ gasLimit: gas * 1000 }));

const { Lottery, LotteryFactory } = compileResult;
const { evm, abi } = LotteryFactory;
const { bytecode } = evm;

const data = {
  accounts: [] as string[],
  manager: "",
  lotteryFactory: null as Contract | null as Contract,
};

beforeEach(async (...args) => {
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(abi);
  const lotteryFactory = await contract.deploy({ data: bytecode.object }).send({ from: accounts[0], gas });
  data.accounts = accounts;
  data.manager = accounts[0];
  data.lotteryFactory = lotteryFactory;
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(data.lotteryFactory.options.address);
  });
  it("create a new lottery", async () => {
    const { lotteryFactory, manager } = data;
    await lotteryFactory.methods.createLottery("Hello", 100).send({ from: manager, gas });
    const res = await lotteryFactory.methods.getLotteries().call({ from: manager });
    assert.ok(res.length === 1);
  });

  it("lottery factory, manager, title, status and unitPrice", async () => {
    const { lotteryFactory, accounts, manager } = data;
    const title = "Hello";
    const unitPrice = 1;
    await lotteryFactory.methods.createLottery(title, unitPrice).send({ from: manager, gas });
    const lotteryAddresses = await lotteryFactory.methods.getLotteries().call({ from: manager });
    const lotteryAddress = lotteryAddresses[0];
    const lottery = new web3.eth.Contract(Lottery.abi, lotteryAddress);
    const titleResponse = await lottery.methods.title().call({ from: manager });
    assert.equal(title, titleResponse);

    const factoryResponse = await lottery.methods.factory().call({ from: manager });
    assert.equal(factoryResponse, lotteryFactory.options.address);

    const managerResponse = await lottery.methods.manager().call({ from: manager });
    assert.equal(managerResponse, manager);

    const statusResponse = await lottery.methods.status().call({ from: manager });
    assert.equal(statusResponse, 0);

    const unitPriceResponse = await lottery.methods.unitPrice().call({ from: manager });
    assert.equal(unitPriceResponse, unitPrice);
  });

  it("add Donation and remove Donation", async () => {
    const { lotteryFactory, accounts, manager } = data;
    const title = "Hello";
    const unitPrice = 1;
    const donationAccount1 = accounts[1];
    const donationAccount2 = accounts[2];
    await lotteryFactory.methods.createLottery(title, unitPrice).send({ from: manager, gas });
    const lotteryAddresses = await lotteryFactory.methods.getLotteries().call({ from: manager });
    const lotteryAddress = lotteryAddresses[0];
    const lottery = new web3.eth.Contract(Lottery.abi, lotteryAddress);
    await lottery.methods.addDonation(donationAccount1, 5).send({ from: manager });
    await lottery.methods.addDonation(donationAccount2, 10).send({ from: manager });
    const { 0: addresses, 1: rates } = await lottery.methods.getDonationRates().call({ from: manager });
    assert.equal(addresses[0], donationAccount1);
    assert.equal(rates[0], 5);
    assert.equal(addresses[1], donationAccount2);
    assert.equal(rates[1], 10);

    await lottery.methods.removeDonation(donationAccount1).send({ from: manager });
    const { 0: afterAddresses, 1: afterRates } = await lottery.methods.getDonationRates().call({ from: manager });
    assert.equal(afterAddresses[0], donationAccount2);
    assert.equal(afterRates[0], 10);
  });

  it("change status", async () => {
    const { lotteryFactory, accounts, manager } = data;
    const title = "Hello";
    const unitPrice = 1;

    await lotteryFactory.methods.createLottery(title, unitPrice).send({ from: manager, gas });
    const lotteryAddresses = await lotteryFactory.methods.getLotteries().call({ from: manager });
    const lotteryAddress = lotteryAddresses[0];
    const lottery = new web3.eth.Contract(Lottery.abi, lotteryAddress);

    const beforeResponse = await lottery.methods.status().call({ from: manager });
    assert.equal(beforeResponse, 0);

    await lottery.methods.activation().send({ from: manager, gas });

    const afterResponse = await lottery.methods.status().call({ from: manager });
    assert.equal(afterResponse, 1);
  });

  it("buy ticket before activation", async () => {
    const { lotteryFactory, accounts, manager } = data;
    const title = "Hello";
    const unitPrice = 1;
    const buyerAccount = accounts[3];
    await lotteryFactory.methods.createLottery(title, unitPrice).send({ from: manager, gas });
    const lotteryAddresses = await lotteryFactory.methods.getLotteries().call({ from: manager });
    const lotteryAddress = lotteryAddresses[0];
    const lottery = new web3.eth.Contract(Lottery.abi, lotteryAddress);
    try {
      await lottery.methods.buyTicket().send({ from: buyerAccount, value: unitPrice });
      assert.fail();
    } catch (e) {
      assert.ok(e);
    }
  });

  it("buy ticket after activation", async () => {
    const { lotteryFactory, accounts, manager } = data;
    const title = "Hello";
    const unitPrice = 1;
    const buyerAccount = accounts[3];
    await lotteryFactory.methods.createLottery(title, unitPrice).send({ from: manager, gas });
    const lotteryAddresses = await lotteryFactory.methods.getLotteries().call({ from: manager });
    const lotteryAddress = lotteryAddresses[0];
    const lottery = new web3.eth.Contract(Lottery.abi, lotteryAddress);
    await lottery.methods.activation().send({ from: manager, gas });
    await lottery.methods.buyTicket().send({ from: buyerAccount, value: unitPrice, gas });
    const res = await lottery.methods.getTicketsByAddress(buyerAccount).call({ from: manager });
    assert.deepEqual(res, ["1"]);
  });
});
