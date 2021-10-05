import { ethers } from 'ethers';
import React, { useMemo } from 'react';
import { getRpcProvider } from 'service/rpc-provider-factory';
import { Network } from 'utils/networks';

const localProviderContext = React.createContext<ethers.providers.JsonRpcProvider | void>(
  undefined,
);
interface Props {
  network: Network;
}

export const LocalProviderProvider: React.FunctionComponent<Props> = ({ network, children }) => {
  const localProvider = useMemo(() => getRpcProvider(network), []);
  return (
    <localProviderContext.Provider value={localProvider}>{children}</localProviderContext.Provider>
  );
};

export const useLocalProvider = (): ethers.providers.JsonRpcProvider => {
  const localProvider = React.useContext(localProviderContext);
  if (!localProvider) {
    throw new Error('useLocalProvider must be used within LocalProviderProvider.');
  }
  return localProvider;
};
