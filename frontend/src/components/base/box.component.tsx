import React, { HTMLAttributes, MutableRefObject } from 'react';
import styled, { css } from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
  innerRef?: MutableRefObject<HTMLDivElement>;
}

export const Box: React.FunctionComponent<Props> = ({ innerRef, ...rest }) => (
  <SyledDiv ref={innerRef} {...rest} />
);

// TODO move this to theme
export const BoxStyle = css`
  display: flex;
  flex: none;
  position: relative;
  min-width: 0;
  min-height: 0;
`;

const SyledDiv = styled.div`
  ${BoxStyle};
`;
