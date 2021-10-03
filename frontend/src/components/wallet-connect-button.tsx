import { Button } from '@mui/material';
import { APP_NAME, DEFAULT_NETWORK } from 'constants';
import React from 'react';
import WalletLink from 'walletlink';
import Web3 from 'web3';

interface Props {
  web3: Web3;
  onWalletConnected: (addresses: string[]) => void;
}

export const WalletConnectButton: React.FunctionComponent<Props> = ({
  web3,
  onWalletConnected,
}) => {
  const defaultNetwork = DEFAULT_NETWORK();
  const walletLink = new WalletLink({
    appName: APP_NAME,
  });
  const walletLinkProvider = walletLink.makeWeb3Provider(
    defaultNetwork.rpcUrl,
    defaultNetwork.chainId,
  );
  const connectWallet = (): void => {
    const i = 0;
    if (i > 1) {
      web3.eth.requestAccounts().then(onWalletConnected);
    }
  };
  return (
    <Button variant="outlined" onClick={connectWallet}>
      Outlined
    </Button>
  );
};
