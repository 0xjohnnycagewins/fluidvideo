import { CircularProgress } from '@mui/material';
import { Box } from 'components/base/box';
import { Span } from 'components/base/span';
import { isEmpty, isNil } from 'ramda';
import React, { useMemo } from 'react';
import 'video.js/dist/video-js.css';
import styled from 'styled-components';
import VREPlayer from 'videojs-react-enhanced';

interface Props extends VREPlayer.IPlayerOptions {
  playbackId: string | undefined;
  active?: boolean;
  onPlay?: VoidFunction;
  onPause?: VoidFunction;
  onEnded?: VoidFunction;
}

export const VideoPlayer: React.FunctionComponent<Props> = ({
  active,
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
      height: 620,
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

const VideoNotLive = styled(({ width, height, ...rest }) => <Box {...rest} />)`
  height: ${(props): string => props.height}px;
  width: ${(props): string => props.width}px;
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
    height: ${(props): string => props.height}px;
    width: ${(props): string => props.width}px;
  }
`;

const Player = styled(({ width, height, ...rest }) => <VREPlayer {...rest} />)`
  height: ${(props): string => props.height}px;
  width: ${(props): string => props.width}px;
`;
