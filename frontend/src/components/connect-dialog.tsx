import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import React, { useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { useHistory } from 'react-router-dom';
import { Routes } from 'service/routing';

export const ConnectDialog: React.FunctionComponent = () => {
  const { authenticate } = useMoralis();
  useEffect((): void => {
    authenticate();
  }, []);
  const history = useHistory();

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogContentText>Please connect your wallet to see this page.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => history.replace(Routes.main)}>Take me back home</Button>
      </DialogActions>
    </Dialog>
  );
};
