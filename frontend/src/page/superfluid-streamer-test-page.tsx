import { Web3Provider } from '@ethersproject/providers';
import { User } from '@superfluid-finance/js-sdk/src/User';
import { Box } from 'components/base/box';
import { Column } from 'components/base/column';
import { WalletConnectButton } from 'components/wallet-connect-button';
import { ethers } from 'ethers';
import { useInjectedProvider } from 'provider/injected-provider-provider';
import { SuperfluidWrapper, useSuperfluid } from 'provider/superfluid-provider';
import { isNil } from 'ramda';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const daixTokenAddress = '0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00';
const cfaAddress = '0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8';

export const SuperfluidStreamerTestPage: React.FunctionComponent = () => {
  const [cfaAbi, setCfaAbi] = useState();
  const sf: SuperfluidWrapper = useSuperfluid();
  const provider = useInjectedProvider();
  useEffect(() => {
    if (isNil(cfaAbi) || isNil(provider)) {
      return undefined;
    }
    const contract = new ethers.Contract(cfaAddress, cfaAbi!, provider!.provider);
    contract.on(
      'FlowUpdated',
      (token, sender, receiver, flowRate, totalSenderFlowRate, totalReceiverFlowRate, userData) => {
        console.log(
          `got a FlowUpdated event with flow: ${flowRate}, total sender: ${totalSenderFlowRate} total receiver: ${totalReceiverFlowRate}`,
        );
      },
    );
  }, [provider, cfaAbi]);
  let viewer: User;

  // const flowEvents = useEventListener(
  //   cfaContract,
  //   'IConstantFlowAgreementV1',
  //   'FlowUpdated',
  //   provider.provider!,
  //   1,
  // );
  // console.log('📟 flow events:', flowEvents);

  const onWalletConnected = (provider: Web3Provider, address: string) => {
    sf.initialize(provider).then(() => {
      viewer = sf.instance!.user({ address, token: daixTokenAddress });
      viewer
        .details()
        .then((details) => console.log(`details for viewer are: ${JSON.stringify(details)}`))
        .catch((error) => console.log(`got an error for details: ${error}`));
      // @ts-ignore
      setCfaAbi(sf.instance!.contracts.IConstantFlowAgreementV1.abi);
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
