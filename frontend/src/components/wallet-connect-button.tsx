import { Web3Provider } from '@ethersproject/providers';
import { Button } from '@mui/material';
import { ethers } from 'ethers';
import { useWeb3Modal } from 'provider/web3modal-provider';
import { isNil } from 'ramda';
import React, { useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { ExternalProviderWithEvents } from 'utils/ethers';
import { StateKey } from 'utils/recoil';
import Web3 from 'web3';

interface Props {
  web3?: Web3;
  onWalletConnected?: (addresses: string[]) => void;
}

export const WalletConnectButton: React.FunctionComponent<Props> = () => {
  const web3modal = useWeb3Modal();
  // const [injectedProvider, setInjectedProvider] = useRecoilState<Web3Provider>(
  //   atom({
  //     key: StateKey.INJECTED_PROVIDER,
  //     default: {} as Web3Provider,
  //   }),
  // );
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>();

  const logoutOfWeb3Modal = async () => {
    await web3modal.clearCachedProvider();
    if (!isNil(injectedProvider)) {
      const provider = injectedProvider.provider as ExternalProviderWithEvents;
      if (!isNil(provider) && typeof provider.disconnect == 'function') {
        await provider.disconnect();
      }
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  // useEffect((): void => {
  //   const defaultNetwork = DEFAULT_NETWORK();
  //   const walletLink = new WalletLink({
  //     appName: APP_NAME,
  //   });
  // }, []);
  //
  // const walletLinkProvider = walletLink.makeWeb3Provider(
  //   defaultNetwork.rpcUrl,
  //   defaultNetwork.chainId,
  // );

  const connectWallet = (): void => {
    // const i = 0;
    // if (i > 1) {
    //   web3.eth.requestAccounts().then(onWalletConnected);
    // }
  };

  const openModal = (): void => {
    web3modal
      .connect()
      .then((provider: ExternalProviderWithEvents) => {
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
        console.log(`connected to provider`);
        provider.on('chainChanged', (chainId: number) => {
          console.log(`chain changed to ${chainId}! updating providers`);
          setInjectedProvider(new ethers.providers.Web3Provider(provider));
        });

        provider.on('accountsChanged', () => {
          console.log(`account changed!`);
          setInjectedProvider(new ethers.providers.Web3Provider(provider));
        });

        // Subscribe to session disconnection
        provider.on('disconnect', (code: number, reason: string) => {
          console.log(code, reason);
          logoutOfWeb3Modal();
        });
      })
      .catch((error: Error) => {
        console.error(`Could not load web3modal ${error}`);
      });
  };

  return (
    <Button variant="outlined" onClick={openModal}>
      Connect
    </Button>
  );
};
