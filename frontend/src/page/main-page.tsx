import { Box } from 'components/base/box';
import { PageLayout } from 'components/layout/page-layout';
import { Stream, StreamProps } from 'components/stream';
import { streamsMock } from 'mock/streams-mock';
import React from 'react';
import styled from 'styled-components';

export const MainPage: React.FunctionComponent = () => (
  <PageLayout>
    <h1>{'Featured stream'}</h1>

    <h1>{'Live channels we think you’ll like'}</h1>
    <StreamsContainer>
      {streamsMock.map((streamProps: StreamProps, index) => (
        <Stream key={index} {...streamProps} />
      ))}
    </StreamsContainer>
  </PageLayout>
);

const StreamsContainer = styled(Box)`
  width: 100%;
  overflow-y: auto;
  flex-wrap: wrap;
  > div {
    margin: 16px;
  }
`;
