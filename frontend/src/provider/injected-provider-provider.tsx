import { Web3Provider } from '@ethersproject/providers';
import React, { useMemo } from 'react';

export class Web3ProviderWrapper {
  private _provider: Web3Provider | undefined;
  public get provider() {
    return this._provider;
  }
  public set provider(newProvider: Web3Provider | undefined) {
    this._provider = newProvider;
  }
}

const injectedProviderContext = React.createContext<Web3ProviderWrapper | undefined>(undefined);

export const InjectedProviderProvider: React.FunctionComponent = ({ children }) => {
  const injectedProviderWrapper = useMemo(() => new Web3ProviderWrapper(), []);
  return (
    <injectedProviderContext.Provider value={injectedProviderWrapper}>
      {children}
    </injectedProviderContext.Provider>
  );
};

export const useInjectedProvider = (): Web3ProviderWrapper => {
  const injectedProviderWrapper = React.useContext(injectedProviderContext);
  if (!injectedProviderWrapper) {
    throw new Error('useInjectedProvider must be used within LocalProviderProvider.');
  }
  return injectedProviderWrapper;
};
