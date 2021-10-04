import { ethers } from 'ethers';
import { Network, NETWORKS } from 'utils/networks';

/**
 * Returns the network for a given name
 * @param name
 */
const findNetworkWithName = (name: string): Network => {
  for (let networkName in NETWORKS) {
    if (NETWORKS[networkName].name === name) {
      return NETWORKS[networkName];
    }
  }
  throw Error(`There is no network with name ${name}`);
};

/**
 * Returns the network for a given chain id
 * @param chainId
 */
const findNetworkWithChainId = (chainId: number): Network => {
  for (let networkName in NETWORKS) {
    if (NETWORKS[networkName].chainId === chainId) {
      return NETWORKS[networkName];
    }
  }
  throw Error(`There is no network with chainId ${chainId}`);
};

/**
 * Returns an RPC provider for given a network
 * @param network
 */
export const getRpcProvider = (network: Network): ethers.providers.JsonRpcProvider =>
  new ethers.providers.JsonRpcProvider(findNetworkWithChainId(network.chainId).rpcUrl);

/**
 * Returns the selected web3 provider
 */
export const getWeb3Provider = (): ethers.providers.Provider => {
  return new ethers.providers.Web3Provider(window.ethereum as any);
};
