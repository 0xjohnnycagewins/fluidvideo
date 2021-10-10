import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FacebookIcon from '@mui/icons-material/Facebook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import IosShareIcon from '@mui/icons-material/IosShare';
import SendIcon from '@mui/icons-material/Send';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Button, Chip, IconButton, Paper } from '@mui/material';
import { User } from '@superfluid-finance/js-sdk/src/User';
import { Box } from 'components/base/box';
import { Column } from 'components/base/column';
import { Span } from 'components/base/span';
import { ConnectDialog } from 'components/connect-dialog';
import { PageLayout } from 'components/layout/page-layout';
import { SuperfluidConnected } from 'components/superfluid-connected';
import { TipButton } from 'components/tip-button';
import { VideoPlayer } from 'components/video-player';
import { useGetStream } from 'hooks/use-query-streams';
import { useUserAddress } from 'hooks/use-user-address';
import { SuperfluidWrapper, useSuperfluid } from 'provider/superfluid-provider';
import { isEmpty, isNil } from 'ramda';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useHistory, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { daixTokenAddress } from 'utils/constants';
import { getHistoryBlockString } from 'utils/dialog';
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
  const [followed, setFollowed] = useState<boolean>(false);
  const [viewersCount, setViewersCount] = useState(0);
  const [moneyStreamStarted, setMoneyStreamStarted] = useState(false);
  const [startingMoneyStream, setStartingMoneyStream] = useState(false);
  const viewer = useRef<User | undefined>();

  const history = useHistory();

  // useEffect(() => {
  //   const unregisterBlock = history.block((_location: any, action: any) => {
  //     if (action === 'POP') {
  //       return getHistoryBlockString('history.block custom dialog', 'CANCEL', 'YES PROCEED');
  //     }
  //     return null;
  //   });
  //   return (): void => {
  //     unregisterBlock();
  //   };
  // }, []);

  useEffect(() => {
    return () => {
      if (!isNil(viewer.current)) {
        viewer.current
          .flow({
            recipient: streamerAddress,
            flowRate: '0',
          })
          .catch((error) => console.log(`error stopping flow with : ${error}`));
      }
    };
  }, []);

  useEffect((): void => {
    if (isAuthenticated && !superfluidInitialized) {
      sf.initialize()
        .then(() => {
          setSuperfluidInitialized(true);
          viewer.current = sf.instance!.user({ address: address!, token: daixTokenAddress });
          viewer.current?.details().then((details) => {
            const streams = details.cfa.flows.outFlows
              .map((flow: any) => flow.receiver)
              .filter(
                (receiver: string) => receiver.toUpperCase() === streamerAddress.toUpperCase(),
              );
            setMoneyStreamStarted(!isEmpty(streams));
          });
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
    setStartingMoneyStream(true);
    viewer
      .current!.flow({
        recipient: streamerAddress,
        //TODO: Add a pricing here
        flowRate: '38580246913580200',
      })
      .then(() => {
        setStartingMoneyStream(false);
        setMoneyStreamStarted(true);
      })
      // TODO: Add error handling
      .catch((error) => {
        setStartingMoneyStream(false);
        setMoneyStreamStarted(false);
      });
  };

  const stopStreamingFund = () => {
    viewer
      .current!.flow({
        recipient: streamerAddress,
        flowRate: '0',
      })
      .then(() => {
        setStartingMoneyStream(false);
        setMoneyStreamStarted(false);
      })
      .catch((error) => console.log(`error stopping flow with : ${error}`));
  };

  return (
    <PageLayout>
      {isAuthenticated ? (
        <Box>
          <LeftSide>
            <VideoPlayerContainer>
              {moneyStreamStarted ? (
                <VideoPlayer
                  autoplay="play"
                  playbackId={streamData?.playbackId}
                  active={streamData?.isActive}
                  onEnded={stopStreamingFund}
                  onPause={stopStreamingFund}
                />
              ) : (
                <CenteredContainer>
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={!moneyStreamStarted && <SendIcon />}
                    onClick={startStreamingFund}
                    disabled={startingMoneyStream}
                  >
                    {startingMoneyStream ? 'Starting stream...' : 'Start stream'}
                  </Button>
                </CenteredContainer>
              )}
            </VideoPlayerContainer>
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
                <SuperfluidConnected>
                  <TipButton streamerAddress={streamerAddress} />
                </SuperfluidConnected>
              </StreamActions>
            </StreamDetails>
            <StyledPaper>
              <PaperBox>
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
              </PaperBox>
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
  color: #ff6585;
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

const PaperBox = styled(Box)`
  flex: 1 1 auto;
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

const VideoPlayerContainer = styled(Box)`
  width: 1120px;
  height: 630px;
`;

const CenteredContainer = styled(Box)`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;
