import React from 'react';
import 'video.js/dist/video-js.css';
import VREPlayer from 'videojs-react-enhanced';

export const VideoPlayer: React.FunctionComponent = () => {
  const playerOptions: VREPlayer.IPlayerOptions = {
    src: 'https://cdn.livepeer.com/hls/1bc1nsg0kzt7mtjn/index.m3u8',
    controls: true,
    autoplay: 'play',
    width: 1920,
    height: 1080,
  };

  const videojsOptions: VREPlayer.IVideoJsOptions = {
    fluid: true,
  };

  return (
    <VREPlayer
      playerOptions={playerOptions}
      videojsOptions={videojsOptions}
      onReady={(player) => console.log(player)}
      onPlay={() => console.log('Play!')}
      onPause={() => console.log('Pause!')}
      onEnded={() => console.log('Ended!')}
    />
  );
};
