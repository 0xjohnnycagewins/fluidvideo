import { WalletConnectButton } from 'components/wallet-connect-button';
import React from 'react';
import 'video.js/dist/video-js.css';
import VREPlayer from 'videojs-react-enhanced';

export const MainPage: React.FunctionComponent = () => {
  // const SuperfluidSDK = require('@superfluid-finance/js-sdk');
  // const sf = useRef<Nullable<Framework>>(undefined);
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
  //
  // const onWalletConnected = (addresses: string[]): void => {
  //   console.log(`first address is ${addresses[0]}`);
  //   sf.current?.user({
  //     address: addresses[0],
  //     token: '0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00',
  //   });
  // };
  //
  // useEffect(() => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  //   const signer = provider.getSigner();
  //
  //   console.log(`signer is ${signer._address}`);
  //   sf.current = new SuperfluidSDK.Framework({
  //     gasReportType: 'JSON',
  //     isTruffle: false,
  //     ethers: new Web3Provider(window.ethereum as any),
  //   });
  //   sf.current
  //     ?.initialize()
  //     .then(() => {
  //       console.log('initialization worked');
  //     })
  //     .catch((err) => {
  //       console.log(`error initializing with ${JSON.stringify(err)}`);
  //     });
  // }, []);

  return (
    <div style={{ paddingLeft: 32, paddingRight: 32 }}>
      <WalletConnectButton />
      {/*<VREPlayer*/}
      {/*  playerOptions={playerOptions}*/}
      {/*  videojsOptions={videojsOptions}*/}
      {/*  onReady={(player) => console.log(player)}*/}
      {/*  onPlay={() => console.log('Play!')}*/}
      {/*  onPause={() => console.log('Pause!')}*/}
      {/*  onEnded={() => console.log('Ended!')}*/}
      {/*/>*/}
    </div>
  );
};
