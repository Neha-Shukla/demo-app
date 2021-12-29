import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { connect } from "react-redux";
import { accountUpdate } from "../../redux/actions";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import GeneralModal from "./wrongNetworkModal";
import detectEthereumProvider from "@metamask/detect-provider";

function initWeb3(provider) {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
}

const AccountModal = (props) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  let web3Modal = null;
  let web3 = null;
  let provider = null;

  // to initilize the web3Modal

  const init = async () => {
    const providerOptions = {
      // walletconnect: {
      //   package: WalletConnectProvider,
      //   options: {
      //     rpc: {
      //       56: "https://bsc-dataseed.binance.org/",
      //     },
      //     network: "mainnet",
      //   },
      // },
    };

    web3Modal = new Web3Modal({
      network: process.env.REACT_APP_NETWORK,
      cacheProvider: true,
      providerOptions: providerOptions,
    });
    provider = await detectEthereumProvider();
  };

  init();

  useEffect(() => {
    async function update() {
      if (window.sessionStorage.getItem("selected_account") != null) {
        setCurrentAccount(window.sessionStorage.getItem("selected_account"));
        if (provider) {
          web3 = await initWeb3(provider);
          const chainId = await web3.eth.getChainId();
          props.dispatch(
            accountUpdate({
              account: window.sessionStorage.getItem("selected_account"),
              chainId: chainId,
            })
          );
        }
      }
    }

    update();
  }, [window.sessionStorage.getItem("selected_Account"), web3, provider]);
  // action on connect wallet button

  const onConnect = async () => {
    //Detect Provider
    try {
      provider = await web3Modal.connect();
      if (provider.open) {
        await provider.open();
        web3 = initWeb3(provider);
      }
      window.sessionStorage.setItem("Provider", provider);
      if (!provider) {
        console.log("no provider found");
      } else {
        web3 = new Web3(provider);
        await ConnectWallet();
      }
      const chainId = await web3.eth.getChainId();

      if (chainId.toString() !== process.env.REACT_APP_CHAIN_ID) {
        setWrongNetwork(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // connect wallet

  const ConnectWallet = async () => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        // Delete all the cache files
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    try {
      const chainId = await web3.eth.getChainId();

      if (chainId.toString() !== process.env.REACT_APP_CHAIN_ID) {
        console.log("Wrong network");
        setWrongNetwork(true);
        props.dispatch(
          accountUpdate({
            account: null,
            chainId: chainId,
          })
        );
      } else {
        // Get list of accounts of the connected wallet
        setWrongNetwork(false);
        const accounts = await web3.eth.getAccounts();

        // MetaMask does not give you all accounts, only the selected account
        window.sessionStorage.setItem("selected_account", accounts[0]);
        const chainId = await web3.eth.getChainId();
        props.dispatch(
          accountUpdate({
            account: accounts[0],
            chainId: chainId,
          })
        );
        setCurrentAccount(accounts[0]);
        console.log("connected Account", accounts[0]);
      }
    } catch (error) {
      if (error.message) {
        console.log("error", error.message);
      }
    }
  };

  //  disconnect wallet

  const onDisconnect = useCallback(async () => {
    if (!web3) {
      window.sessionStorage.removeItem("selected_account");
    }
    if (web3) {
      const chainId = await web3.eth.getChainId();
      props.dispatch(
        accountUpdate({
          account: null,
          chainId: chainId,
        })
      );
    }
    window.sessionStorage.removeItem("selected_account");
    window.sessionStorage.removeItem("Provider");
    await setCurrentAccount(null);
    if (web3Modal) await web3Modal.clearCachedProvider();
    web3Modal = null;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.disconnect();
    }
    if ("caches" in window) {
      caches.keys().then((names) => {
        // Delete all the cache files
        names.forEach((name) => {
          caches.delete(name);
        });
      });
      if (!wrongNetwork) window.location.reload(true);
    }
  }, [currentAccount]);

  useEffect(() => {
    console.log("provider", provider);
    if (provider) {
      provider.on("chainChanged", async (_chainId) => {
        const chainId = parseInt(_chainId, 16);

        if (chainId.toString() !== process.env.REACT_APP_CHAIN_ID) {
          if (currentAccount) console.log("Wrong Network first");
          setWrongNetwork(true);
          props.dispatch(
            accountUpdate({
              account: null,
              chainId: chainId,
            })
          );
          onDisconnect();
        } else {
          setWrongNetwork(false);
          props.dispatch(
            accountUpdate({
              account: currentAccount,
              chainId: chainId,
            })
          );
        }
      });
    }
  }, [onDisconnect]);

  // function to detect account change

  useEffect(() => {
    if (provider) {
      provider.on("accountsChanged", async function (accounts) {
        const id = await provider.request({ method: "eth_chainId" });
        const chainId = parseInt(id, 16);
        console.log("Account changed", accounts[0]);
        if (
          chainId.toString() === process.env.REACT_APP_CHAIN_ID &&
          currentAccount
        ) {
          setCurrentAccount(accounts[0]);
          console.log("Account changed", accounts[0]);
          window.sessionStorage.removeItem("selected_account");
          window.sessionStorage.setItem("selected_account", accounts[0]);
          props.dispatch(
            accountUpdate({
              account: accounts[0],
              chainId: chainId,
            })
          );
        } else if (chainId.toString() !== process.env.REACT_APP_CHAIN_ID) {
          console.log("Wrong Network");
          setWrongNetwork(true);
          props.dispatch(
            accountUpdate({
              account: null,
              chainId: chainId,
            })
          );
          window.sessionStorage.removeItem("selected_account");
          setCurrentAccount(null);
          await onDisconnect();
        }
      });
    }
  }, [currentAccount]);

  // function to detect network change

  useEffect(() => {
    async function updateAccount() {
      if (provider) {
        const id = await provider.request({ method: "eth_chainId" });
        window.sessionStorage.setItem("selected_account", currentAccount);
        const chainId = parseInt(id, 16);
        props.dispatch(
          accountUpdate({
            account: currentAccount,
            chainId: chainId,
          })
        );
      }
    }
    if (currentAccount) {
      updateAccount();
    }
  }, [currentAccount]);

  return (
    <>
      <button
        style={{ color: props.color }}
        onClick={currentAccount ? onDisconnect : onConnect}
      >
        {window.sessionStorage.getItem("selected_account")
          ? window.sessionStorage.getItem("selected_account").slice(0, 5) +
            "..." +
            window.sessionStorage.getItem("selected_account").slice(37, 42)
          : "Connect Wallet"}
      </button>
      {wrongNetwork ? (
        <GeneralModal
          title={"Wrong Network"}
          message={`Please choose ${process.env.REACT_APP_NETWORK} Network`}
          setShow={setWrongNetwork}
        />
      ) : null}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    account: state.account,
  };
};

export default connect(mapStateToProps)(AccountModal);
