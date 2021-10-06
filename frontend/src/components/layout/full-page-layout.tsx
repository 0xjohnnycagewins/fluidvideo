import { Box } from 'components/base/box.component';
import React from 'react';
import styled from 'styled-components';

interface Props {
  bgImg?: string;
}

export const FullPageLayout: React.FunctionComponent<Props> = ({ children, ...rest }) => (
  <Container {...rest}>{children}</Container>
);

const Container = styled(Box)`
  width: 100%;
  height: 100%;
`;
