import { Web3Provider } from '@ethersproject/providers';
import { Button } from '@mui/material';
import { User } from '@superfluid-finance/js-sdk/src/User';
import { Box } from 'components/base/box';
import { Column } from 'components/base/column';
import { WalletConnectButton } from 'components/wallet-connect-button';
import { SuperfluidWrapper, useSuperfluid } from 'provider/superfluid-provider';
import React from 'react';
import styled from 'styled-components';
import { daixTokenAddress } from 'utils/constants';

const streamerAddress = '0x9e7343Ce1816a7fc21E1c46537F04050F97AfbD9';

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

  // TODO: Add tip amount
  const onTip = (amount: number) => {
    viewer
      .giveShares({ poolId: 1, recipient: streamerAddress, shares: 100 })
      .then(() =>
        viewer.details().then((details) => {
          console.log(`details for viewer to tip are: ${JSON.stringify(details)}`);
          viewer
            .distributeToPool({ poolId: 1, amount })
            .then(() => {
              console.log(`succesfully sent ${amount}`);
              viewer
                .details()
                .then((details) =>
                  console.log(`details for viewer that was tipped: ${JSON.stringify(details)}`),
                );
            })
            .catch((error) => console.log(`error sending funds with: ${error}`));
        }),
      )
      .catch((error) => console.log(`error giving shares with: ${error}`));
  };

  return (
    <Container>
      <RightAlignedColumn>
        <WalletConnectButton onWalletConnected={onWalletConnected} />
        <Button onClick={onStartStreamingFund}>Start sending func to stream</Button>
        <Button onClick={onStopStreamingFund}>Stop sending func to stream</Button>
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
