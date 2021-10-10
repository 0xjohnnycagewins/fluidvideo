import SearchIcon from '@mui/icons-material/Search';
import { AppBar, Button, IconButton, InputBase, Paper, Toolbar } from '@mui/material';
import { Box } from 'components/base/box';
import { Column } from 'components/base/column';
import { ConnectButton } from 'components/connect-button';
import React from 'react';
import { useMoralis } from 'react-moralis';
import { Routes } from 'service/routing';
import styled from 'styled-components';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { Link } from 'react-router-dom';

export const PageLayout: React.FunctionComponent = ({ children }) => {
  const { isAuthenticated } = useMoralis();

  return (
    <Container>
      <AppBar position="static">
        <StyledToolbar>
          <Paper>
            <StyledInputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <ButtonContainer>
            {isAuthenticated && (
              <Button variant="outlined" color="inherit" startIcon={<VideocamOutlinedIcon />}>
                <StyledLink to={Routes.stream}>Start Stream</StyledLink>
              </Button>
            )}
            <StyledConnectButton />
          </ButtonContainer>
        </StyledToolbar>
      </AppBar>
      <ChildrenContainer>{children}</ChildrenContainer>
    </Container>
  );
};

const Container = styled(Column)`
  width: 100%;
  height: 100%;
`;

const StyledToolbar = styled(Toolbar)`
  && {
    align-items: center;
    justify-content: center;
  }
`;

const StyledInputBase = styled(InputBase)`
  && {
    width: 355px;
  }
`;

const StyledConnectButton = styled(ConnectButton)`
  && {
    color: inherit;
    margin-right: 0;
  }
`;

const ButtonContainer = styled(Box)`
  position: absolute;
  top: 0;
  right: 24px;
  height: 64px;
  align-items: center;
  > button:not(:first-child) {
    margin-left: 8px;
  }
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const ChildrenContainer = styled(Column)`
  flex: 1 1 auto;
  padding: 32px 64px;
`;
