import { Button } from '@mui/material';
import { parseProviderOrSigner } from 'eth-hooks/functions/providerOrSigner';
import { ethers } from 'ethers';
import { useInjectedProvider } from 'provider/injected-provider-provider';
import { useWeb3Modal } from 'provider/web3modal-provider';
import { isEmpty, isNil } from 'ramda';
import React, { useCallback, useEffect, useMemo } from 'react';
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
  const injectedProviderWrapper = useInjectedProvider();
  const injectedProviderChainIdState = useMemo(
    () =>
      atom({
        key: StateKey.INJECTED_PROVIDER_CHAIN_ID,
        default: 0,
      }),
    [],
  ); // TODO create a factory to generate these as singletons with lazy loading
  const userAddressState = useMemo(
    () =>
      atom({
        key: StateKey.USER_ADDRESS,
        default: '',
      }),
    [],
  ); // TODO create a factory to generate these as singletons with lazy loading
  const [_injectedProviderChainId, setInjectedProviderChainId] = useRecoilState<number>(
    injectedProviderChainIdState,
  );
  const [userAddress, setUserAddress] = useRecoilState<string>(userAddressState);

  const disconnect = useCallback((): void => {
    web3modal.clearCachedProvider();
    setInjectedProviderChainId(0);
    setUserAddress('');
  }, [web3modal, setInjectedProviderChainId, setUserAddress]);

  const setInjectedProvider = (provider: ExternalProviderWithEvents): void => {
    injectedProviderWrapper.provider = new ethers.providers.Web3Provider(provider);
    parseProviderOrSigner(injectedProviderWrapper.provider).then((providerAndSigner) => {
      if (isNil(providerAndSigner?.signer)) {
        disconnect();
      } else {
        setInjectedProviderChainId(providerAndSigner?.providerNetwork?.chainId ?? 0);
        providerAndSigner?.signer?.getAddress().then((address) => {
          setUserAddress(address);
        });
      }
    });
  };

  const logoutOfWeb3Modal = () => {
    const injectedProvider = injectedProviderWrapper.provider;
    if (!isNil(injectedProvider)) {
      const provider = injectedProvider.provider as ExternalProviderWithEvents;
      if (!isNil(provider) && typeof provider.disconnect == 'function') {
        provider.disconnect().then(() => {
          disconnect();
        });
      }
    } else {
      disconnect();
    }
  };

  const openModal = (): void => {
    web3modal
      .connect()
      .then((provider: ExternalProviderWithEvents) => {
        console.log(`connected to provider`);
        setInjectedProvider(provider);

        provider.on('chainChanged', (chainId: number) => {
          console.log(`chain changed to ${chainId}! updating providers`);
          setInjectedProvider(provider);
        });

        provider.on('accountsChanged', () => {
          console.log(`account changed!`);
          setInjectedProvider(provider);
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

  // mount
  useEffect((): void => {
    if (web3modal.cachedProvider) {
      openModal();
    }
  }, []);

  return (
    <Button variant="outlined" onClick={openModal} disabled={!isEmpty(userAddress)}>
      {isEmpty(userAddress) ? 'Connect' : userAddress}
    </Button>
  );
};
