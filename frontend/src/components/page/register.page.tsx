import { FullPageLayout } from 'components/layout/full-page-layout';
import { RegisterContainer } from 'components/register/register-container';
import React from 'react';
import styled from 'styled-components';

interface Props {
  redirectToPath?: string;
}

export const RegisterPage: React.FunctionComponent<Props> = ({ redirectToPath }) => (
  <FullPageLayoutCentered>
    <RegisterContainer />
  </FullPageLayoutCentered>
);

const FullPageLayoutCentered = styled(FullPageLayout)`
  align-items: center;
  justify-content: center;
`;
