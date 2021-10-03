import { Button } from '@mui/material';
import React from 'react';
import Web3 from 'web3';

interface Props {
  web3: Web3;
  onWalletConnected: (addresses: string[]) => void;
}

export const WalletConnectButton: React.FunctionComponent<Props> = ({
  web3,
  onWalletConnected,
}) => {
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
