import { Button, Paper } from '@mui/material';
import { User } from '@superfluid-finance/js-sdk/src/User';
import { Column } from 'components/base/column';
import { ConnectDialog } from 'components/connect-dialog';
import { PageLayout } from 'components/layout/page-layout';
import { SuperfluidConnected } from 'components/superfluid-connected';
import { TipButton } from 'components/tip-button';
import { VideoPlayer } from 'components/video-player';
import { useGetStream } from 'hooks/use-query-streams';
import { useUserAddress } from 'hooks/use-user-address';
import { SuperfluidWrapper, useSuperfluid } from 'provider/superfluid-provider';
import React, { useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { daixTokenAddress } from 'utils/constants';
import { getAtom, StateKey } from 'utils/recoil';

interface StreamPageParameters {
  streamerAddress: string;
  streamId: string;
}

export const StreamPage: React.FunctionComponent = () => {
  const { isAuthenticated } = useMoralis();
  const sf: SuperfluidWrapper = useSuperfluid();
  const superfluidInitializedState = getAtom<boolean>(StateKey.SUPERFLUID_INITIALIZED);
  const [superfluidInitialized, setSuperfluidInitialized] = useRecoilState(
    superfluidInitializedState,
  );
  const address = useUserAddress();
  const { streamId, streamerAddress } = useParams<StreamPageParameters>();
  const { data: streamData } = useGetStream(streamId);
  let viewer: User;

  useEffect((): void => {
    if (isAuthenticated && !superfluidInitialized) {
      sf.initialize()
        .then(() => {
          setSuperfluidInitialized(true);
          viewer = sf.instance!.user({ address: address!, token: daixTokenAddress });
          viewer
            .details()
            .then((details) => console.log(`details for viewer are: ${JSON.stringify(details)}`))
            .catch((error) => console.log(`got an error for details: ${error}`));
        })
        .catch((error) => {
          console.log(`Error initializing the Superfluid SDK: ${error}`);
          setSuperfluidInitialized(false);
        });
    }
  }, [isAuthenticated, superfluidInitialized]);

  const onStartStreamingFund = () => {
    viewer
      .flow({
        recipient: streamerAddress,
        //TODO: Add a pricing here
        flowRate: '38580246913580200',
      })
      .then(() => console.log(`started flowing`))
      .catch((error) => console.log(`error flowing with : ${error}`));
  };

  const onStopStreamingFund = () => {
    viewer
      .flow({
        recipient: streamerAddress,
        flowRate: '0',
      })
      .then(() => console.log(`stop flow`))
      .catch((error) => console.log(`error stopping flow with : ${error}`));
  };

  return (
    <PageLayout>
      {isAuthenticated ? (
        <Column>
          <VideoPlayer
            playbackId={streamData?.playbackId}
            active={streamData?.isActive}
            streamKey={streamData?.streamKey}
          />

          <Paper>
            <SuperfluidConnected>
              <Button onClick={onStartStreamingFund}>Start sending func to stream</Button>
              <Button onClick={onStopStreamingFund}>Stop sending func to stream</Button>
              <TipButton streamerAddress={streamerAddress} />
            </SuperfluidConnected>
          </Paper>
        </Column>
      ) : (
        <ConnectDialog />
      )}
    </PageLayout>
  );
};
