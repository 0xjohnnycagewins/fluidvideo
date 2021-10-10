import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { AppBar, Button, IconButton, InputBase, Paper, Toolbar } from '@mui/material';
import { Box } from 'components/base/box';
import { Column } from 'components/base/column';
import { ConnectButton } from 'components/connect-button';
import React from 'react';
import { useMoralis } from 'react-moralis';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Routes } from 'service/routing';
import styled from 'styled-components';

export const PageLayout: React.FunctionComponent = ({ children }) => {
  const { isAuthenticated } = useMoralis();
  const history = useHistory();
  const location = useLocation();

  return (
    <Container>
      <AppBar position="static">
        <StyledToolbar>
          <Paper>
            <StyledInputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" />
            <StyledHomeButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </StyledHomeButton>
          </Paper>
          <HomeButtonContainer>
            <IconButton color="default" onClick={() => history.push(Routes.main)}>
              <HomeOutlinedIcon />
            </IconButton>
          </HomeButtonContainer>
          <ButtonContainer>
            {isAuthenticated && location.pathname === Routes.main && (
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
  background: rgb(16, 16, 16);
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

const StyledHomeButton = styled(IconButton)`
  && {
    color: inherit;
    margin-right: 0;
  }
`;

const StyledConnectButton = styled(ConnectButton)`
  && {
    color: inherit;
    margin-right: 0;
  }
`;

const HomeButtonContainer = styled(Box)`
  position: absolute;
  top: 0;
  left: 24px;
  height: 64px;
  align-items: center;
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
