import path from "path";
import fs from "fs-extra";
import solc from "solc";
import { Lottery } from "./types";

// const buildPath = path.resolve(__dirname, "build");
// fs.removeSync(buildPath);
// const contractsPath = path.resolve(__dirname, "../contracts");
// const fileNames = fs.readdirSync(contractsPath);

// const compilerInput = {
//   language: "Solidity",
//   sources: fileNames.reduce((input, fileName) => {
//     const filePath = path.resolve(contractsPath, fileName);
//     const source = fs.readFileSync(filePath, "utf8");
//     return { ...input, [fileName]: { content: source } };
//   }, {}),
//   settings: { outputSelection: { "*": { "*": ["*"] } } },
// };

const lotteryPath = path.resolve(__dirname, "../contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

const compilerInput = {
  language: "Solidity",
  sources: {
    Lottery: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(compilerInput)));
export default compiled.contracts.Lottery.LotteryFactory as Lottery;
