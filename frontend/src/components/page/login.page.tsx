import { PageLayout } from 'components/layout/page-layout';
import { LoginContainer } from 'components/login/login-container';
import React from 'react';
import styled from 'styled-components';

interface Props {
  redirectToPath?: string;
}

export const LoginPage: React.FunctionComponent<Props> = ({ redirectToPath }) => (
  <FullPageLayoutCentered>
    <LoginContainer />
  </FullPageLayoutCentered>
);

const FullPageLayoutCentered = styled(PageLayout)`
  align-items: center;
  justify-content: center;
`;
