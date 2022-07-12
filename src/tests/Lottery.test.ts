// contract test code will go here
import assert from "assert";
import Web3 from "web3";
import compiled from "../compile";

const ganache = require("ganache-cli");
const web3 = new Web3(ganache.provider());

const { evm, abi } = compiled;
const { bytecode } = evm;

const data = {
  accounts: [] as any[],
  lottery: null as any,
};

beforeEach(async (...args) => {
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(abi);
  const deployed = contract.deploy({ data: bytecode.object });
  const lottery = await deployed.send({ from: accounts[0], gas: 1000000 });
  data.accounts = accounts;
  data.lottery = lottery;
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(data.lottery.options.address);
  });
  it("allow multiple accounts to enter player", async () => {
    await data.lottery.methods.enter().send({
      from: data.accounts[0],
      value: web3.utils.toWei("0.01", "ether"),
    });
    await data.lottery.methods.enter().send({
      from: data.accounts[1],
      value: web3.utils.toWei("0.01", "ether"),
    });
    await data.lottery.methods.enter().send({
      from: data.accounts[2],
      value: web3.utils.toWei("0.01", "ether"),
    });
    const players = await data.lottery.methods.getPlayers().call({
      from: data.accounts[0],
    });

    assert.equal(data.accounts[0], players[0]);
    assert.equal(data.accounts[1], players[1]);
    assert.equal(data.accounts[2], players[2]);
    assert.equal(players.length, 3);
  });
  it("require a minimum amount of enter to enter", async () => {
    try {
      await data.lottery.methods.enter().send({
        from: data.accounts[0],
        value: web3.utils.toWei("0.009", "ether"),
      });
      assert(false);
    } catch (e) {
      assert(e);
    }
  });
  it("manager can pick up winner", async () => {
    await data.lottery.methods.enter().send({
      from: data.accounts[1],
      value: web3.utils.toWei("0.01", "ether"),
    });
    const initialBalance = Number(await web3.eth.getBalance(data.accounts[1]));
    await data.lottery.methods.pickWinner().send({ from: data.accounts[0] });
    const prevWinner = await data.lottery.methods.prevWinner().call();

    const finalBalance = Number(await web3.eth.getBalance(data.accounts[1]));
    const difference = finalBalance - initialBalance;
    assert.ok(difference > Number(web3.utils.toWei("0.009", "ether")));
    assert.equal(data.accounts[1], prevWinner);
  });
  it("not manager can not pick up winner", async () => {
    await data.lottery.methods.enter().send({
      from: data.accounts[0],
      value: web3.utils.toWei("0.01", "ether"),
    });

    try {
      await data.lottery.methods.pickWinner().send({ from: data.accounts[1] });
      assert(false);
    } catch (e) {
      assert.ok(e);
    }
  });
});
