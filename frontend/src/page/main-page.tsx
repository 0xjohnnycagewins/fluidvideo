import { Box } from 'components/base/box.component';
import React from 'react';
import styled from 'styled-components';

export const MainPage: React.FunctionComponent = () => <Container>{'hello'}</Container>;

const Container = styled(Box)`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
