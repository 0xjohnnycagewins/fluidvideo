import { BoxStyle } from 'components/base/box';
import React, { HTMLAttributes, MutableRefObject } from 'react';
import styled, { css } from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
  innerRef?: MutableRefObject<HTMLDivElement>;
}

export const Column: React.FunctionComponent<Props> = ({ innerRef, ...rest }) => (
  <SyledDiv ref={innerRef} {...rest} />
);

// TODO move this to theme
export const ColumnStyle = css`
  ${BoxStyle};
  flex-direction: column;
`;

const SyledDiv = styled.div`
  ${ColumnStyle};
`;
