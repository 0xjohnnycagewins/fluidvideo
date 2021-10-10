import { Dialog, DialogContent, DialogContentText } from '@mui/material';
import React, { useEffect } from 'react';
import { useMoralis } from 'react-moralis';

export const ConnectDialog: React.FunctionComponent = () => {
  const { authenticate } = useMoralis();
  useEffect((): void => {
    authenticate();
  }, []);

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogContentText>Please connect your wallet to see this page.</DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
9;
