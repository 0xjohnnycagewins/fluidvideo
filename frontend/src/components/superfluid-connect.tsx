import { Web3Provider } from '@ethersproject/providers';
import { SuperfluidButton } from 'components/superfluid-button';
import { WalletConnectButton } from 'components/wallet-connect-button';
import { useSuperfluid } from 'provider/superfluid-provider';
import React from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { getAtom, StateKey } from 'utils/recoil';

export const SuperfluidConnect: React.FunctionComponent = () => {
  const superfluid = useSuperfluid();
  const superfluidInitializedState = getAtom<boolean>(StateKey.SUPERFLUID_INITIALIZED);
  const [_superfluidInitialized, setSuperfluidInitialized] = useRecoilState(
    superfluidInitializedState,
  );

  // TODO add these in a constant
  const onWalletConnected = (provider: Web3Provider, address: string): void => {
    superfluid
      .initialize(provider)
      .then(() => {
        console.log(`superfluid initialized`);
        superfluid.instance?.user({
          address,
          token: '0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00',
        });
        setSuperfluidInitialized(true);
      })
      .catch((error) => {
        console.error(`error initializing superfluid ${error.message}`);
        setSuperfluidInitialized(false);
      });
  };

  return (
    <Container style={{ paddingLeft: 32, paddingRight: 32 }}>
      <WalletConnectButton onWalletConnected={onWalletConnected} />
      <StyledSuperfluidButton />
    </Container>
  );
};

const Container = styled.div`
  padding-left: 32px;
  padding-right: 32px;
`;

const StyledSuperfluidButton = styled(SuperfluidButton)`
  padding-left: 16px;
`;
