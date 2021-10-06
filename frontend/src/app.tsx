import { MainPage } from 'page/main-page';
import { InjectedProviderProvider } from 'provider/injected-provider-provider';
import { LocalProviderProvider } from 'provider/local-provider-provider';
import { SuperfluidProvider } from 'provider/superfluid-provider';
import { Web3ModalProvider } from 'provider/web3modal-provider';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { NETWORKS } from 'utils/networks';

export const App: React.FunctionComponent = () => (
  <RecoilRoot>
    <LocalProviderProvider network={NETWORKS.localhost}>
      <InjectedProviderProvider>
        <Web3ModalProvider>
          <SuperfluidProvider>
            <Switch>
              <Route path="/" component={MainPage} />
            </Switch>
          </SuperfluidProvider>
        </Web3ModalProvider>
      </InjectedProviderProvider>
    </LocalProviderProvider>
  </RecoilRoot>
);
