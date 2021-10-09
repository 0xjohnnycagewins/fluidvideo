import { Chip } from '@mui/material';
import { FlowList } from '@superfluid-finance/js-sdk';
import { ethers } from 'ethers';
import { useInjectedProvider } from 'provider/injected-provider-provider';
import { useSuperfluid } from 'provider/superfluid-provider';
import { isNil } from 'ramda';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { daixTokenAddress } from 'utils/constants';
import { convertFlowRatePerMonthToSeconds, convertTokenToDai, getDeposit } from 'utils/flow';
import { getAtom, StateKey } from 'utils/recoil';
import { ReactComponent as DaiIcon } from 'static/daiIcon.svg';

const cfaAddress = '0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8';

export const MoneyStreamChip: React.FunctionComponent = () => {
  const sf = useSuperfluid();
  const provider = useInjectedProvider();
  const userAddressState = getAtom<string>(StateKey.USER_ADDRESS);
  const address = useRecoilValue(userAddressState);
  const [currentDeposit, setCurrentDeposit] = useState(0);
  // TODO: Fix typing
  const startFlowTimeoutIds: any = useMemo(() => new Map(), []);

  const startFlow = (sender: string, flowRate: number) =>
    startFlowTimeoutIds.set(
      sender,
      setInterval(
        () =>
          setCurrentDeposit(
            (prevState) =>
              prevState + convertFlowRatePerMonthToSeconds(convertTokenToDai(flowRate)),
          ),
        1000,
      ),
    );

  const stopFlow = (sender: string) => {
    clearInterval(startFlowTimeoutIds.get(sender));
    startFlowTimeoutIds.delete(sender);
  };

  // TODO: Add typing
  const stopAllFlow = () => startFlowTimeoutIds.forEach(stopFlow);

  useEffect(() => {
    sf.instance!.cfa?.listFlows({
      superToken: daixTokenAddress,
      account: address,
      onlyInFlows: true,
    }).then((flowList: FlowList) =>
      flowList.inFlows.map((inFlowInfo) =>
        sf
          .instance!.cfa?.getFlow({
            superToken: daixTokenAddress,
            sender: inFlowInfo.sender,
            receiver: inFlowInfo.receiver,
          })
          .then((flowInfo) => {
            setCurrentDeposit(
              (oldValue) =>
                oldValue + getDeposit(flowInfo!.timestamp, Number.parseInt(flowInfo!.flowRate)),
            );
            startFlow(inFlowInfo.sender, Number.parseInt(flowInfo!.flowRate));
          }),
      ),
    );
    // Add event listener on flow
    const contract = new ethers.Contract(
      cfaAddress,
      // @ts-ignore
      sf.instance!.contracts.IConstantFlowAgreementV1.abi!,
      provider!.provider,
    );
    contract.on('FlowUpdated', (token, sender, receiver, flowRate) => {
      const flowRateInt = Number.parseInt(flowRate);
      if (flowRateInt > 0) {
        startFlow(sender, Number.parseInt(flowRate));
      } else {
        stopFlow(sender);
      }
    });
    return () => stopAllFlow();
  }, []);

  if (isNil(address)) {
    return <></>;
  }
  return <Chip icon={<DaiIcon />} label={currentDeposit.toFixed(2)} variant="outlined" />;
};
