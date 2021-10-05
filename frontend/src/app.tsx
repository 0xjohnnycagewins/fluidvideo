import { MainPage } from 'page/main-page';
import { InjectedProviderProvider } from 'provider/injected-provider-provider';
import { LocalProviderProvider } from 'provider/local-provider-provider';
import { Web3ModalProvider } from 'provider/web3modal-provider';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { NETWORKS } from 'utils/networks';

export const App: React.FunctionComponent = () => (
  <RecoilRoot>
    <LocalProviderProvider network={NETWORKS.localhost}>
      <InjectedProviderProvider>
        <Web3ModalProvider>
          <MainPage />
        </Web3ModalProvider>
      </InjectedProviderProvider>
    </LocalProviderProvider>
  </RecoilRoot>
);
