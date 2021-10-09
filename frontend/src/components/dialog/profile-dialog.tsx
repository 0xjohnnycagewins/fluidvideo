import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Dialog, Paper, Tooltip } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog/Dialog';
import { Column } from 'components/base/column';
import copy from 'copy-to-clipboard';
import { isNil } from 'ramda';
import React, { useState } from 'react';
import { useMoralis } from 'react-moralis';
import styled from 'styled-components';

export const ProfileDialog: React.FunctionComponent<DialogProps> = ({ onClose, open }) => {
  const { logout, isAuthenticated, user, isAuthenticating, isLoggingOut } = useMoralis();
  const [addressCopied, setAddressCopied] = useState<boolean>(false);
  const userAddress = user?.get('ethAddress');

  if (!isAuthenticated || isNil(user)) {
    onClose?.({}, 'backdropClick');
    return null;
  }

  return (
    <Paper>
      <Dialog onClose={onClose} open={open} onBackdropClick={() => onClose?.({}, 'backdropClick')}>
        <Container>
          <AccountCircleIcon sx={{ fontSize: 80 }} />
          <InfoContainer>
            <Tooltip title={addressCopied ? 'Copied' : 'Copy'} placement={'top'}>
              <Button
                variant="text"
                fullWidth
                endIcon={<ContentCopyIcon />}
                onMouseLeave={() => setTimeout(() => setAddressCopied(false), 200)}
                onClick={() => {
                  copy(userAddress);
                  setAddressCopied(true);
                }}
              >
                <AddressText>{userAddress}</AddressText>
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              onClick={() => logout().then(() => onClose?.({}, 'backdropClick'))}
              disabled={isAuthenticating || isLoggingOut}
            >
              Logout
            </Button>
          </InfoContainer>
        </Container>
      </Dialog>
    </Paper>
  );
};

const Container = styled(Column)`
  padding: 24px 16px;
  width: 256px;
  justify-content: center;
  align-items: center;
`;

const AddressText = styled.p`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const InfoContainer = styled(Column)`
  margin-top: 32px;
  width: 100%;
  justify-content: center;
  align-items: center;
  > button:not(:first-child) {
    margin-top: 8px;
  }
`;
