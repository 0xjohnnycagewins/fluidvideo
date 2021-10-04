import { MainPage } from 'page/main-page';
import { LocalProviderProvider } from 'provider/local-provider-provider';
import { Web3ModalProvider } from 'provider/web3modal-provider';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { NETWORKS } from 'utils/networks';

export const App: React.FunctionComponent = () => (
  <RecoilRoot>
    <LocalProviderProvider network={NETWORKS.localhost}>
      <Web3ModalProvider>
        <MainPage />
      </Web3ModalProvider>
    </LocalProviderProvider>
  </RecoilRoot>
);
