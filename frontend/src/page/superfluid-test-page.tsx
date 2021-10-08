import { Web3Provider } from '@ethersproject/providers';
import { Button } from '@mui/material';
import { User } from '@superfluid-finance/js-sdk/src/User';
import { Box } from 'components/base/box.component';
import { Column } from 'components/base/column.component';
import { WalletConnectButton } from 'components/wallet-connect-button';
import { SuperfluidWrapper, useSuperfluid } from 'provider/superfluid-provider';
import React from 'react';
import styled from 'styled-components';

const streamerAddress = '0x9e7343Ce1816a7fc21E1c46537F04050F97AfbD9';
const daixTokenAddress = '0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2';

export const SuperfluidTestPage: React.FunctionComponent = () => {
  const sf: SuperfluidWrapper = useSuperfluid();
  let viewer: User;

  const onWalletConnected = (provider: Web3Provider, address: string) => {
    sf.initialize(provider).then(() => {
      viewer = sf.instance!.user({ address, token: daixTokenAddress });
      viewer
        .details()
        .then((details) => console.log(`details for viewer are: ${JSON.stringify(details)}`))
        .catch((error) => console.log(`got an error for details: ${error}`));
      viewer
        .createPool({ poolId: 1 })
        .then(() => console.log(`pool created`))
        .catch((error) => console.log(`error creating the pool with: ${error}`));
    });
  };

  const onStartStreamingFund = () => {
    viewer
      .flow({
        recipient: streamerAddress,
        flowRate: '385802469135802',
      })
      .then((flow) => console.log(`started flowing with: ${JSON.stringify(flow)}`))
      .catch((error) => console.log(`error flowing with : ${error}`));
  };

  // TODO: Add tip amount
  const onTip = (amount: number) => {
    viewer
      .giveShares({ poolId: 1, recipient: streamerAddress, shares: 100 })
      .then(() => {
        viewer
          .distributeToPool({ poolId: 1, amount })
          .then(() => console.log(`succesfully sent ${amount}`))
          .catch((error) => console.log(`error sending funds with: ${error}`));
      })
      .catch((error) => console.log(`error giving shares with: ${error}`));
  };

  return (
    <Container>
      <RightAlignedColumn>
        <WalletConnectButton onWalletConnected={onWalletConnected} />
        <Button onClick={onStartStreamingFund}>Start sending func to stream</Button>
        <Button onClick={() => onTip(10)}>Send tip</Button>
      </RightAlignedColumn>
    </Container>
  );
};

const Container = styled(Box)`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const RightAlignedColumn = styled(Column)`
  align-items: flex-end;
  justify-content: flex-end;
`;
