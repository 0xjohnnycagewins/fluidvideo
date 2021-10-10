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
  onPlay?: VoidFunction;
  onPause?: VoidFunction;
  onEnded?: VoidFunction;
}

export const VideoPlayer: React.FunctionComponent<Props> = ({
  active,
  streamKey,
  playbackId,
  onPlay,
  onPause,
  onEnded,
}) => {
  const playerOptions: VREPlayer.IPlayerOptions = useMemo(
    () => ({
      src: `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`,
      controls: true,
      autoplay: 'play',
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
        <CircularProgress />
      </VideoNotLive>
    );
  }

  if (!active) {
    if (!isNil(streamKey) && !isEmpty(streamKey)) {
      return (
        <VideoNotLiveStreamer width={playerOptions.width} height={playerOptions.height}>
          <p>
            <ColoredSpan>{'To stream, use these information'}</ColoredSpan>
          </p>
          <p>
            <ColoredSpan>{`Server: rtmp://rtmp.livepeer.com/live`}</ColoredSpan>
          </p>
          <p>
            <ColoredSpan>{`Stream Key: ${streamKey}`}</ColoredSpan>
          </p>
        </VideoNotLiveStreamer>
      );
    }
    return (
      <VideoNotLive width={playerOptions.width} height={playerOptions.height}>
        <ColoredSpan>{'There is no active stream.'}</ColoredSpan>
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
  width: ${(props): number => props.width - 48}px;
  background-color: black;
  padding: 24px;
`;

const VideoNotLive = styled(({ width, height, ...rest }) => <Box {...rest} />)`
  height: ${(props): number => props.height - 48}px;
  width: ${(props): number => props.width - 48}px;
  align-items: center;
  justify-content: center;
  background-color: black;
`;

// TODO add color to style instead
const ColoredSpan = styled(Span)`
  color: rgb(222, 222, 227);
`;

const PlayerContainer = styled(({ width, height, ...rest }) => <div {...rest} />)`
  > div {
    height: ${(props): number => props.height - 48}px;
    width: ${(props): number => props.width - 48}px;
  }
`;

const Player = styled(({ width, height, ...rest }) => <VREPlayer {...rest} />)`
  height: ${(props): string => props.height}px;
  width: ${(props): string => props.width}px;
`;
