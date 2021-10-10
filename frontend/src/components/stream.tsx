import { Chip } from '@mui/material';
import { Box } from 'components/base/box';
import { Column } from 'components/base/column';
import { Span } from 'components/base/span';
import React from 'react';
import styled from 'styled-components';

export interface StreamProps {
  imgSrc: string;
  avatarSrc: string;
  viewersCount: string; // FIXME would normally be a number...
  title: string;
  streamer: string;
}

const LiveChip: React.FunctionComponent = () => (
  <StyledLiveChip label="LIVE" size="small" color={'error'} />
);

const ViewersCountChip: React.FunctionComponent<{ count: string }> = ({ count }) => (
  <StyledViewersCountChip label={`${count} viewers`} size="small" />
);

export const Stream: React.FunctionComponent<StreamProps> = ({
  imgSrc,
  avatarSrc,
  viewersCount,
  title,
  streamer,
}) => {
  return (
    <Container>
      <Box>
        <StyledImg src={imgSrc} />
        <LiveChip />
        <ViewersCountChip count={viewersCount} />
      </Box>
      <Details>
        <AvatarImg src={avatarSrc} />
        <InfoContainer>
          <Title ellipsis>{title}</Title>
          <Name ellipsis>{streamer}</Name>
        </InfoContainer>
      </Details>
    </Container>
  );
};

const Container = styled(Column)`
  width: 312px;
  cursor: pointer;
`;

const StyledLiveChip = styled(Chip)`
  background-color: red;
  position: absolute;
  top: 16px;
  left: 16px;
`;

const StyledViewersCountChip = styled(Chip)`
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  bottom: 16px;
  left: 16px;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 176px;
`;

const AvatarImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
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
