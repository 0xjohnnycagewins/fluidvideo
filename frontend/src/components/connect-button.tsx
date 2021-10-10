import { IconButton } from '@mui/material';
import { ProfileDialog } from 'components/dialog/profile-dialog';
import React, { useCallback, useState } from 'react';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { useMoralis } from 'react-moralis';

export const ConnectButton: React.FunctionComponent = (props) => {
  const { authenticate, isAuthenticated } = useMoralis();
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);

  // TODO check that the network is Polygon

  const onClick = useCallback((): void => {
    if (isAuthenticated) {
      setDialogOpened(!dialogOpened);
    } else {
      authenticate({ chainId: 80001 }); // TODO change for mainnet when in prod (check env)
    }
  }, [authenticate, isAuthenticated, dialogOpened]);

  return (
    <IconButton
      size="large"
      edge="start"
      aria-label="menu"
      sx={{ mr: 2 }}
      onClick={onClick}
      {...props}
    >
      {isAuthenticated ? <AccountBoxOutlinedIcon /> : <AccountBalanceWalletOutlinedIcon />}
      {dialogOpened && <ProfileDialog open={true} onClose={() => setDialogOpened(false)} />}
    </IconButton>
  );
};
