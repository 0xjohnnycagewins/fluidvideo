import { IconButton, InputBase, Paper } from '@mui/material';
import { useUserAddress } from 'eth-hooks';
import { ethers } from 'ethers';
import { useInjectedProvider } from 'provider/injected-provider-provider';
import React, { useState } from 'react';
import { ReactComponent as DaiIcon } from 'static/daiIcon.svg';

interface Props {
  streamerAddress: string;
}

export const TipButton: React.FunctionComponent<Props> = ({ streamerAddress }) => {
  const provider = useInjectedProvider();
  const address = useUserAddress(provider.provider);
  const [tipValue, setTipValue] = useState(0);
  // TODO: Fix typing
  const tipValueChanger = (event: any) => {
    if (Number.parseInt(event.target.value)) {
      setTipValue(event.target.value);
    } else {
      setTipValue(0);
    }
  };
  const sendTip = () => {
    console.log(`will tip ${tipValue}`);
    provider
      .provider!.getSigner(address)
      .sendTransaction({ value: ethers.utils.parseEther(tipValue.toString()), to: streamerAddress })
      .then((transaction) => {
        console.dir(transaction);
        alert('Send finished!');
      });
  };
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      {/* TODO: Add validation */}
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Tip amount (in USD)"
        onChange={tipValueChanger}
      />
      <IconButton onClick={sendTip} disabled={tipValue <= 0}>
        <DaiIcon />
      </IconButton>
    </Paper>
  );
};
