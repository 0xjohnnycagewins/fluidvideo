import React, { MouseEventHandler } from 'react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

export interface TextProps {
  id?: string;
  className?: string | string[];
  ellipsis?: boolean;
  multiline?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
}

export const Span: React.FunctionComponent<TextProps> = ({ ellipsis, multiline, ...rest }) => {
  return <StyledSpan ellipsis={ellipsis} multiline={multiline} {...rest} />;
};

const StyledSpan = styled(({ ellipsis, multiline, ...rest }) => <span {...rest} />)<{
  ellipsis: boolean;
  multiline: boolean;
}>`
  min-width: 0;
  max-width: 100%;
  ${(props): FlattenSimpleInterpolation | null =>
    props.ellipsis &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `};

  ${(props): FlattenSimpleInterpolation | null =>
    props.multiline &&
    css`
      white-space: pre-wrap;
    `}

  ${(props): FlattenSimpleInterpolation | null =>
    props.onClick &&
    css`
      cursor: pointer;
    `}
`;
