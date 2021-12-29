import bep20Abi from "../Config/abis/bep20Abi.json";
import { getAddress } from "./addressHelper";
import { getUserBalance, getWeb3 } from "./currentWalletHelper";
import contracts from "../Config/contracts";

export const getTokenContract = async () => {
  try {
    let web3 = await getWeb3();
    let token = await new web3.eth.Contract(
      bep20Abi,
      await getAddress(contracts.eqx)
    );
    console.log("token", token);
    return token;
  } catch (e) {
    console.log(e);
  }
};

// export const getAllowance = async (tokenName, account) => {
//   try {
//     let web3 = await getWeb3();
//     let token = await getTokenContract(tokenName);
//     let crowdsaleAddress = await getAddress(contracts.crowdsale);
//     let allowance = await token.methods
//       .allowance(account, crowdsaleAddress)
//       .call();
//     console.log(
//       "allowance",
//       await web3.utils.fromWei(allowance.toString(), "ether")
//     );
//     return await web3.utils.fromWei(allowance.toString(), "ether");
//   } catch (e) {
//     console.log(e);
//   }
// };

export const getTokenBalance = async (tokenName, account) => {
  try {
    let web3 = await getWeb3();
    let token = await getTokenContract(tokenName);
    let balance;
    if (tokenName == "bnb") {
      balance = await getUserBalance();
    } else balance = await token.methods.balanceOf(account).call();
    console.log(
      "balance",
      await web3.utils.fromWei(balance.toString(), "ether")
    );
    return await web3.utils.fromWei(balance.toString(), "ether");
  } catch (e) {
    console.log(e);
  }
};

// export const checkIfApproved = async (inputAmount, tokenName, account) => {
//   try {
//     let allowance = await getAllowance(tokenName, account);
//     console.log("allowances", inputAmount, allowance);
//     if (Number(allowance) < Number(inputAmount)) {
//       console.log("false");
//       return false;
//     } else {
//       console.log("true");
//       return true;
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
