import { Web3Provider } from '@ethersproject/providers';
import { Box } from 'components/base/box';
import { Column } from 'components/base/column';
import { MoneyStreamChip } from 'components/money-stream-chip';
import { SuperfluidConnected } from 'components/superfluid-connected';
import { WalletConnectButton } from 'components/wallet-connect-button';
import { SuperfluidWrapper, useSuperfluid } from 'provider/superfluid-provider';
import React from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { getAtom, StateKey } from 'utils/recoil';

export const SuperfluidStreamerTestPage: React.FunctionComponent = () => {
  const sf: SuperfluidWrapper = useSuperfluid();
  const superfluidInitializedState = getAtom<boolean>(StateKey.SUPERFLUID_INITIALIZED);
  const [, setSuperfluidInitialized] = useRecoilState(superfluidInitializedState);

  const onWalletConnected = (provider: Web3Provider, _address: string) => {
    sf.initialize(provider)
      .then(() => {
        setSuperfluidInitialized(true);
      })
      .catch((error) => {
        console.log(`Error initializing the Superfluid SDK: ${error}`);
        setSuperfluidInitialized(false);
      });
  };

  return (
    <Container>
      <RightAlignedColumn>
        <WalletConnectButton onWalletConnected={onWalletConnected} />
        <SuperfluidConnected>
          <MoneyStreamChip />
        </SuperfluidConnected>
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
