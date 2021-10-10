import { Chip } from '@mui/material';
import { Box } from 'components/base/box';
import { Column } from 'components/base/column';
import { Span } from 'components/base/span';
import React from 'react';
import styled from 'styled-components';

interface Props {
  viewersCount: number | undefined;
  title: string | undefined;
  streamer: string | undefined;
}

const LiveChip: React.FunctionComponent = () => <StyledLiveChip label="LIVE" color={'error'} />;

const ViewersCountChip: React.FunctionComponent<{ count: number | undefined }> = ({ count }) => (
  <StyledViewersCountChip label={`${count ?? '834K'} viewers`} />
);

export const FeaturedStream: React.FunctionComponent<Props> = ({
  viewersCount,
  title,
  streamer,
}) => {
  return (
    <Container>
      <Box>
        <StyledImg src={`mock/featured-stream.jpg`} />
        <LiveChip />
        <ViewersCountChip count={viewersCount} />
      </Box>
      <Details>
        <AvatarImg src={`mock/featured-stream-avatar.png`} />
        <InfoContainer>
          <Title ellipsis>{title ?? 'Magic Tournament 2021'}</Title>
          <Name ellipsis>{streamer ?? 'magic.eth'}</Name>
        </InfoContainer>
      </Details>
    </Container>
  );
};

const Container = styled(Column)`
  width: 1120px;
  cursor: pointer;
`;

const StyledLiveChip = styled(Chip)`
  background-color: red;
  position: absolute;
  top: 16px;
  left: 16px;
  && .MuiChip-root {
    height: 24px;
  }
  span {
    padding-right: 16px;
    padding-left: 16px;
  }
`;

const StyledViewersCountChip = styled(Chip)`
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: 16px;
  left: 16px;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 630px;
`;

const AvatarImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;

const Details = styled(Box)`
  margin-top: 8px;
`;

const InfoContainer = styled(Column)`
  width: 100%;
  flex: 1;
  margin-left: 8px;
  span:not(:first-child) {
    margin-top: 2px;
  }
`;

const Title = styled(Span)`
  font-size: 14px;
  font-weight: bold;
`;

const Name = styled(Span)`
  font-size: 13px;
`;
