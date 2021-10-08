import { Web3Provider } from '@ethersproject/providers';
import { User } from '@superfluid-finance/js-sdk/src/User';
import { Box } from 'components/base/box.component';
import { Column } from 'components/base/column.component';
import { WalletConnectButton } from 'components/wallet-connect-button';
import { SuperfluidWrapper, useSuperfluid } from 'provider/superfluid-provider';
import React from 'react';
import styled from 'styled-components';

const daixTokenAddress = '0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00';

export const SuperfluidStreamerTestPage: React.FunctionComponent = () => {
  const sf: SuperfluidWrapper = useSuperfluid();
  let viewer: User;

  const onWalletConnected = (provider: Web3Provider, address: string) => {
    sf.initialize(provider).then(() => {
      viewer = sf.instance!.user({ address, token: daixTokenAddress });
      viewer
        .details()
        .then((details) => console.log(`details for viewer are: ${JSON.stringify(details)}`))
        .catch((error) => console.log(`got an error for details: ${error}`));
    });
  };

  return (
    <Container>
      <RightAlignedColumn>
        <WalletConnectButton onWalletConnected={onWalletConnected} />
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
