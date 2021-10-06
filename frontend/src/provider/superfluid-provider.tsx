import { Web3Provider } from '@ethersproject/providers';
import { Framework } from '@superfluid-finance/js-sdk/src/Framework';
import React, { useMemo } from 'react';
import { Nullable } from 'typescript-nullable';

const SuperfluidSDK = require('@superfluid-finance/js-sdk');

// TODO use singleton pattern
export class SuperfluidWrapper {
  private _instance: Nullable<Framework>;

  public get instance() {
    return this._instance;
  }
  public initialize(provider: Web3Provider): Promise<void> {
    this._instance = new SuperfluidSDK.Framework({
      ethers: provider,
    });
    return this._instance!.initialize();
  }
}

const superfluidContext = React.createContext<SuperfluidWrapper | undefined>(undefined);

export const SuperfluidProvider: React.FunctionComponent = ({ children }) => {
  const superfluidWrapper = useMemo(() => new SuperfluidWrapper(), []);
  return (
    <superfluidContext.Provider value={superfluidWrapper}>{children}</superfluidContext.Provider>
  );
};

export const useSuperfluid = (): SuperfluidWrapper => {
  const superfluidWrapper = React.useContext(superfluidContext);
  if (!superfluidWrapper) {
    throw new Error('useSuperfluid must be used within SuperfluidProvider.');
  }
  return superfluidWrapper;
};
