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

console.log("beforeEach123");
beforeEach(async (...args) => {
  console.log("beforeEach123");
  const accounts = await web3.eth.getAccounts();
  console.log({ accounts });
  const balance = await web3.eth.getBalance(accounts[0]);
  console.log({ balance });
  const contract = new web3.eth.Contract(abi);
  const lottery = await contract
    .deploy({ data: bytecode.object })
    .send({ from: accounts[0], gas: 100000000000000000 });

  data.accounts = accounts;
  data.lottery = lottery;
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    console.log({ lottery: data.lottery });
    // assert.ok(data.lottery.options.address);
  });
});
