import { Alert, IconButton, InputBase, Paper, Snackbar } from '@mui/material';
import Moralis from 'moralis';
import React, { useCallback, useState } from 'react';
import { ReactComponent as DaiIcon } from 'static/daiIcon.svg';
import { daixTokenAddress } from 'utils/constants';

interface Props {
  streamerAddress: string;
}

enum TipState {
  NONE,
  SUCCESS,
  ERROR,
}

export const TipButton: React.FunctionComponent<Props> = ({ streamerAddress }) => {
  const [tipValue, setTipValue] = useState(0);
  const [tipState, setTipState] = useState<TipState>(TipState.NONE);

  const tipValueChanger = (event: any) => {
    if (Number.parseInt(event.target.value)) {
      setTipValue(event.target.value);
    } else {
      setTipValue(0);
    }
  };

  const resetTipState = useCallback(() => {
    setTipState(TipState.NONE);
  }, []);

  const sendTip = () => {
    Moralis.Web3.transfer({
      type: 'erc20',
      amount: Moralis.Units.Token(tipValue, 18),
      receiver: streamerAddress,
      contractAddress: daixTokenAddress,
    })
      .then(() => setTipState(TipState.SUCCESS))
      .catch(() => setTipState(TipState.ERROR));
  };
  return (
    <>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
      >
        {/* TODO: Add validation */}
        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Tip amount" onChange={tipValueChanger} />
        <IconButton onClick={sendTip} disabled={tipValue <= 0}>
          <DaiIcon />
        </IconButton>
      </Paper>
      <Snackbar
        open={tipState === TipState.SUCCESS}
        autoHideDuration={6000}
        onClose={resetTipState}
      >
        <Alert onClose={resetTipState} severity="success" sx={{ width: '100%' }}>
          {`Successly sent a tip of ${tipValue} to ${streamerAddress}`}
        </Alert>
      </Snackbar>
      <Snackbar open={tipState === TipState.ERROR} autoHideDuration={6000} onClose={resetTipState}>
        <Alert onClose={resetTipState} severity="error" sx={{ width: '100%' }}>
          {`Error sending tip to ${streamerAddress} :(`}
        </Alert>
      </Snackbar>
    </>
  );
};
