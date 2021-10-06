import { Web3Provider } from '@ethersproject/providers';
import { Button } from '@mui/material';
import { parseProviderOrSigner } from 'eth-hooks/functions/providerOrSigner';
import { ethers } from 'ethers';
import { useInjectedProvider } from 'provider/injected-provider-provider';
import { useWeb3Modal } from 'provider/web3modal-provider';
import { isEmpty, isNil } from 'ramda';
import React, { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { ExternalProviderWithEvents } from 'utils/ethers';
import { StateKey, getAtom } from 'utils/recoil';

interface Props {
  onWalletConnected?: (provider: Web3Provider, address: string) => void;
}

export const WalletConnectButton: React.FunctionComponent<Props> = ({ onWalletConnected }) => {
  const web3modal = useWeb3Modal();
  const injectedProviderWrapper = useInjectedProvider();
  const injectedProviderChainIdState = getAtom<number>(StateKey.INJECTED_PROVIDER_CHAIN_ID);
  const userAddressState = getAtom<string>(StateKey.USER_ADDRESS);
  const [_injectedProviderChainId, setInjectedProviderChainId] = useRecoilState(
    injectedProviderChainIdState,
  );
  const [userAddress, setUserAddress] = useRecoilState(userAddressState);

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
          onWalletConnected?.(injectedProviderWrapper.provider!, address);
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
