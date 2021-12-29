import { connect } from "react-redux";
import {
  mintTokens,
  burnTokens,
  transferTokens,
} from "../helpers/setterFunctions";
import { useState } from "react";

const Main = (props) => {
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [recepient, setRecepient] = useState("");

  async function mint() {
    if (props.account && props.account.account && mintAmount)
      await mintTokens(props.account.account, mintAmount);
  }

  async function burn() {
    if (props.account && props.account.account && burnAmount)
      await burnTokens(props.account.account, burnAmount);
  }

  async function transfer() {
    if (props.account && props.account.account && transferAmount && recepient)
      await transferTokens(props.account.account, recepient, transferAmount);
  }

  return (
    <div>
      <br />
      <br />
      <label>Enter Mint Amount (only owner can mint)</label>
      <br />
      <input
        type="text"
        value={mintAmount}
        onChange={(e) => setMintAmount(e.target.value)}
      ></input>
      <br />
      <button onClick={mint}>Mint</button>
      <br />
      <br />
      <label>Enter tokens to be burned </label>
      <br />
      <input
        type="text"
        value={burnAmount}
        onChange={(e) => setBurnAmount(e.target.value)}
      ></input>
      <br />
      <button onClick={burn}>Burn</button>
      <br />
      <br />
      <label>Enter Recepient address </label>
      <br />
      <input
        type="text"
        value={recepient}
        onChange={(e) => setRecepient(e.target.value)}
      ></input>
      <br />
      <label>Enter transfer amount </label>
      <br />
      <input
        type="text"
        value={transferAmount}
        onChange={(e) => setTransferAmount(e.target.value)}
      ></input>
      <br />
      <button onClick={transfer}>Transfer</button>
      <br />
      <br />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    account: state.account,
  };
};
export default connect(mapStateToProps)(Main);
