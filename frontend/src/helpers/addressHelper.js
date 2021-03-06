export const getAddress = (address) => {
  const mainNetChainId = 1;
  const chainId = process.env.REACT_APP_CHAIN_ID || mainNetChainId;
  return address[chainId] ? address[chainId] : address[mainNetChainId];
};
