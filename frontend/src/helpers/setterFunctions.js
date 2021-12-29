import Web3 from "web3";
import { getWeb3 } from "./currentWalletHelper";
import { getTokenContract } from "./getterFunctions";

// export const approveTokens = async (account) => {
//     let token = await getTokenContract(tokenName);
//     let crowdsaleAddress = await getAddress(contracts.crowdsale);
//     let tokenAmount = "10000000000000000000000000000000000000000";
//     let res = await token.methods.approve(crowdsaleAddress, tokenAmount).send({ from: account })
//     return res;
// }

export const mintTokens = async (account, amount) => {
  let token = await getTokenContract();
  let web3 = await getWeb3();
  amount = await web3.utils.toWei(amount);
  let res = await token.methods.mint(account, amount).send({ from: account });
  return res;
};

export const burnTokens = async (account, amount) => {
  let token = await getTokenContract();
  let web3 = await getWeb3();
  amount = await web3.utils.toWei(amount);
  let res = await token.methods.burn(amount).send({ from: account });
  return res;
};

export const transferTokens = async (account, recepient, amount) => {
  let token = await getTokenContract();
  let web3 = await getWeb3();
  amount = await web3.utils.toWei(amount);
  let res = await token.methods
    .transfer(recepient, amount)
    .send({ from: account });
  return res;
};
