import { CircularProgress } from '@mui/material';
import { Box } from 'components/base/box';
import { Column } from 'components/base/column';
import { Span } from 'components/base/span';
import { isEmpty, isNil } from 'ramda';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import 'video.js/dist/video-js.css';
import VREPlayer from 'videojs-react-enhanced';

interface Props extends VREPlayer.IPlayerOptions {
  playbackId: string | undefined;
  active?: boolean;
  streamKey?: string;
  autoplay?: 'muted' | 'play' | 'any';
  onPlay?: VoidFunction;
  onPause?: VoidFunction;
  onEnded?: VoidFunction;
}

export const VideoPlayer: React.FunctionComponent<Props> = ({
  active,
  streamKey,
  playbackId,
  autoplay,
  onPlay,
  onPause,
  onEnded,
}) => {
  const playerOptions: VREPlayer.IPlayerOptions = useMemo(
    () => ({
      src: `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`,
      controls: true,
      autoplay: autoplay,
      width: 1120,
      height: 630,
    }),
    [playbackId],
  );

  const videojsOptions: VREPlayer.IVideoJsOptions = useMemo(
    () => ({
      fluid: true,
    }),
    [],
  );

  if (isNil(playbackId) || isEmpty(playbackId)) {
    return (
      <VideoNotLive width={playerOptions.width} height={playerOptions.height}>
        <CircularProgress color={'secondary'} />
      </VideoNotLive>
    );
  }

  if (!active) {
    if (!isNil(streamKey) && !isEmpty(streamKey)) {
      return (
        <VideoNotLiveStreamer width={playerOptions.width} height={playerOptions.height}>
          <p>
            <Span>{'To stream, use these information'}</Span>
          </p>
          <p>
            <Span>{`Server: rtmp://rtmp.livepeer.com/live`}</Span>
          </p>
          <p>
            <Span>{`Stream Key: ${streamKey}`}</Span>
          </p>
        </VideoNotLiveStreamer>
      );
    }
    return (
      <VideoNotLive width={playerOptions.width} height={playerOptions.height}>
        <Span>{'There is no active stream.'}</Span>
      </VideoNotLive>
    );
  }

  return (
    <PlayerContainer width={playerOptions.width} height={playerOptions.height}>
      <Player
        width={playerOptions.width}
        height={playerOptions.height}
        playerOptions={playerOptions}
        videojsOptions={videojsOptions}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
      />
    </PlayerContainer>
  );
};

const VideoNotLiveStreamer = styled(({ width, height, ...rest }) => <Column {...rest} />)`
  height: ${(props): number => props.height - 48}px;
  width: 100%;
  background-color: black;
  padding: 24px;
`;

const VideoNotLive = styled(({ width, height, ...rest }) => <Box {...rest} />)`
  height: ${(props): number => props.height - 48}px;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: black;
`;

const PlayerContainer = styled(({ width, height, ...rest }) => <div {...rest} />)`
  > div {
    height: ${(props): number => props.height}px;
    width: 100%;
  }
`;

const Player = styled(({ width, height, ...rest }) => <VREPlayer {...rest} />)`
  height: ${(props): string => props.height}px;
  width: ${(props): string => props.width}px;
`;
