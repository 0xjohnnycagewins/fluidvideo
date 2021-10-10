import { Box } from 'components/base/box';
import { FeaturedStream } from 'components/featured-stream';
import { PageLayout } from 'components/layout/page-layout';
import { Stream, StreamProps } from 'components/stream';
import { streamsMock } from 'mock/streams-mock';
import { StreamModel } from 'model/stream-model';
import Moralis from 'moralis';
import { compile } from 'path-to-regexp';
import { isEmpty, isNil } from 'ramda';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from 'service/routing';
import styled from 'styled-components';

export const MainPage: React.FunctionComponent = () => {
  const history = useHistory();
  const [featuredStream, setFeaturedStream] = useState<StreamModel | undefined>();

  // fetch featured stream on mount
  useEffect(() => {
    setTimeout(() => {
      const query = new Moralis.Query('Stream');
      query.first().then((result) => {
        if (!isNil(result)) {
          setFeaturedStream({
            fees: result.get('fees'),
            streamId: result.get('streamId'),
            streamerAddress: result.get('streamerAddress'),
            title: result.get('title'),
            viewersCount: result.get('viewersCount'),
          });
        }
      });
    }, 1);
  }, []);

  const featuredStreamLink = useMemo(() => {
    if (
      isNil(featuredStream) ||
      isNil(featuredStream?.streamerAddress) ||
      isEmpty(featuredStream?.streamerAddress) ||
      isNil(featuredStream?.streamId) ||
      isEmpty(featuredStream?.streamId)
    ) {
      return null;
    }
    return compile(Routes.viewStream)({
      streamerAddress: featuredStream?.streamerAddress,
      streamId: featuredStream?.streamId,
    });
  }, [featuredStream]);

  return (
    <PageLayout>
      <h1>{'Featured stream'}</h1>
      <FeaturedStreamContainer onClick={() => history.push(featuredStreamLink ?? Routes.main)}>
        <FeaturedStream
          viewersCount={featuredStream?.viewersCount}
          title={featuredStream?.title}
          streamer={featuredStream?.streamerAddress}
        />
      </FeaturedStreamContainer>
      <h1>{'Live channels we think you’ll like'}</h1>
      <StreamsContainer>
        {streamsMock.map((streamProps: StreamProps, index) => (
          <Stream key={index} {...streamProps} />
        ))}
      </StreamsContainer>
    </PageLayout>
  );
};

const FeaturedStreamContainer = styled(Box)`
  width: 100%;
  justify-content: center;
  span {
    color: inherit;
    text-decoration: none;
  }
`;

const StreamsContainer = styled(Box)`
  width: 100%;
  overflow-y: auto;
  flex-wrap: wrap;
  > div {
    margin: 16px;
  }
`;
