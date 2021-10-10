import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { Button, Chip, IconButton, Paper } from '@mui/material';
import { User } from '@superfluid-finance/js-sdk/src/User';
import { Box } from 'components/base/box';
import { Column } from 'components/base/column';
import { Span } from 'components/base/span';
import { ConnectDialog } from 'components/connect-dialog';
import { PageLayout } from 'components/layout/page-layout';
import { VideoPlayer } from 'components/video-player';
import { useGetStream } from 'hooks/use-query-streams';
import { useUserAddress } from 'hooks/use-user-address';
import { SuperfluidWrapper, useSuperfluid } from 'provider/superfluid-provider';
import React, { useCallback, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { daixTokenAddress } from 'utils/constants';
import { getAtom, StateKey } from 'utils/recoil';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';

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
  const [followed, setFollowed] = useState<boolean>(false);
  const [viewersCount, setViewersCount] = useState(0);
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

  const switchFollow = useCallback(() => {
    setFollowed(!followed);
  }, [followed, setFollowed]);

  const startStreamingFund = () => {
    viewer
      .flow({
        recipient: streamerAddress,
        //TODO: Add a pricing here
        flowRate: '38580246913580200',
      })
      .then(() => console.log(`started flowing`))
      .catch((error) => console.log(`error flowing with : ${error}`));
  };

  const stopStreamingFund = () => {
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
        <Box>
          <LeftSide>
            <VideoPlayer playbackId={streamData?.playbackId} active={streamData?.isActive} />
            <StreamDetails>
              <StreamerInfo>
                <AccountCircleIcon sx={{ fontSize: 100, color: 'gold' }} />
                <StreamerDetails>
                  <StreamerAddress>{streamerAddress}</StreamerAddress>
                  <StreamTitle>{'Stream Title'}</StreamTitle>
                  <StreamerActions>
                    <Button
                      onClick={switchFollow}
                      startIcon={followed ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      variant="contained"
                      size="small"
                    >
                      Follow
                    </Button>
                    <StyledIconButton aria-label="share">
                      <IosShareIcon />
                    </StyledIconButton>
                  </StreamerActions>
                </StreamerDetails>
              </StreamerInfo>
              <StreamActions>
                <Chip
                  avatar={<GroupOutlinedIcon height={18} />}
                  variant="outlined"
                  label={`${viewersCount} viewers`}
                />
                {/*<SuperfluidConnected>*/}
                {/*  <TipButton streamerAddress={streamerAddress} />*/}
                {/*</SuperfluidConnected>*/}
              </StreamActions>
            </StreamDetails>
            <StyledPaper>
              <Box>
                <PaperColumnLeft>
                  <AboutStreamer>{`About ${streamerAddress}`}</AboutStreamer>
                  <AboutFollowers>{'136K followers'}</AboutFollowers>
                  <AboutMe>
                    {
                      "Hi, I'm Lindsay! I'm a 30 year old fulltime streamer and cosplayer from Phoenix, Arizona. I stream a variety of games, mostly RPGs, FPSs, and MMOs, with a focus on new releases. Live Monday-Saturday whenever I wake up :)"
                    }
                  </AboutMe>
                </PaperColumnLeft>
                <PaperColumnRight>
                  <Button startIcon={<InstagramIcon />} variant="text" size="small" fullWidth>
                    Instagram
                  </Button>
                  <Button startIcon={<FacebookIcon />} variant="text" size="small" fullWidth>
                    Facebook
                  </Button>
                  <Button startIcon={<YouTubeIcon />} variant="text" size="small" fullWidth>
                    YouTube
                  </Button>
                  <Button startIcon={<TwitterIcon />} variant="text" size="small" fullWidth>
                    Twitter
                  </Button>
                </PaperColumnRight>
              </Box>
            </StyledPaper>
          </LeftSide>
        </Box>
      ) : (
        <ConnectDialog />
      )}
    </PageLayout>
  );
};

const LeftSide = styled(Column)`
  width: 1120px;
  height: 100%;
`;

const StreamDetails = styled(Box)`
  margin-top: 8px;
`;

const StreamerInfo = styled(Box)`
  flex: 1 1 auto;
`;

const StreamerDetails = styled(Column)`
  margin-left: 16px;
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const StreamerAddress = styled(Span)`
  margin: 12px 0 0;
  font-size: 18px;
  font-weight: bold;
  color: hotpink;
`;

const StreamTitle = styled(Span)`
  font-size: 14px;
  font-weight: bold;
`;

const StreamerActions = styled(Box)`
  flex: 1 1 auto;
  align-items: flex-start;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const StreamActions = styled(Box)`
  flex: 1 1 auto;
  justify-content: flex-end;
  align-items: flex-start;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const StyledIconButton = styled(IconButton)`
  && {
    padding-top: 2px;
  }
`;

const StyledPaper = styled(Paper)`
  padding: 40px;
  margin-top: 16px;
  width: 100%;
`;

const PaperColumnLeft = styled(Column)`
  flex: 1 1 auto;
  > :not(:first-child) {
    margin-top: 24px;
  }
  padding-right: 12px;
`;

const PaperColumnRight = styled(Column)`
  > :not(:first-child) {
    margin-top: 12px;
  }
  padding-left: 32px;
  > button {
    justify-content: flex-start;
  }
`;

const AboutStreamer = styled(Span)`
  font-size: 24px;
  font-weight: bold;
`;

const AboutFollowers = styled(Span)`
  font-size: 14px;
  font-weight: bold;
`;

const AboutMe = styled(Span)`
  font-size: 14px;
`;
