import { Box } from 'components/base/box';
import { VideoPlayer } from 'components/video-player';
import { useHttpClient } from 'provider/http-client-provider';
import React from 'react';
import { useQuery } from 'react-query';
import { Stream } from 'service/http/model/stream';
import styled from 'styled-components';

export const StreamerPage: React.FunctionComponent = () => {
  const streamId = '1bc1b108-1181-45e1-8e17-0ccae43d260b'; // TODO get it from the db
  const httpClient = useHttpClient();
  const { isLoading, error, data } = useQuery<Stream>('getStream', () =>
    httpClient.get(`stream/${streamId}`).then((res) => res.data),
  );

  return (
    <Container>
      <VideoPlayer playbackId={data?.playbackId} active={data?.isActive} />
    </Container>
  );
};

const Container = styled(Box)`
  height: 100%;
  width: 100%;
  padding: 16px 32px;
`;
