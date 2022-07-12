// contract test code will go here
import assert from "assert";
import Web3 from "web3";
import compiled from "../compile";

const ganache = require("ganache-cli");
const web3 = new Web3(ganache.provider({ gasLimit: 100000000000000 }));

const { evm, abi } = compiled;
const { bytecode } = evm;

const data = {
  accounts: [] as any[],
  lottery: null as any,
};

beforeEach(async (...args) => {
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(abi);
  const lottery = await contract
    .deploy({ data: bytecode.object })
    .send({ from: accounts[0], gas: 10000000 });
  data.accounts = accounts;
  data.lottery = lottery;
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(data.lottery.options.address);
  });
});
