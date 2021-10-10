import { Web3Provider } from '@ethersproject/providers';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { Chip } from '@mui/material';
import { FlowList } from '@superfluid-finance/js-sdk';
import { Box } from 'components/base/box';
import { ethers } from 'ethers';
import { useUserAddress } from 'hooks/use-user-address';
import { Event, EventType } from 'model/event-model';
import { useSuperfluid } from 'provider/superfluid-provider';
import { isNil, reject } from 'ramda';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as DaiIcon } from 'static/daiIcon.svg';
import styled from 'styled-components';
import { daixTokenAddress } from 'utils/constants';
import { convertFlowRatePerMonthToSeconds, convertTokenToDai, getDeposit } from 'utils/flow';

const cfaAddress = '0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8';

export const StreamMetricsChips: React.FunctionComponent = () => {
  const sf = useSuperfluid();
  const address = useUserAddress();
  const [currentDeposit, setCurrentDeposit] = useState(0);
  // TODO: Fix typing
  const startFlowTimeoutIds: any = useMemo(() => new Map(), []);
  const provider = useMemo(() => new Web3Provider(window.ethereum), []);
  const [viewersCount, setViewersCount] = useState(0);
  const viewers = useRef<string[]>([]);

  const addViewer = useCallback(
    (viewer: string) => {
      if (!viewers.current.includes(viewer)) {
        viewers.current.push(viewer);
        setViewersCount(viewersCount + 1);
      }
    },
    [viewers, viewersCount],
  );

  const removeViewer = useCallback(
    (viewer: string) => {
      if (viewers.current.includes(viewer)) {
        viewers.current = reject((v: string) => v === viewer, viewers.current);
        if (viewersCount >= 1) {
          setViewersCount(viewersCount - 1);
        } else {
          setViewersCount(0);
        }
      }
    },
    [viewers, viewersCount],
  );

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
      account: address!,
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
            addViewer(inFlowInfo.sender);
          }),
      ),
    );
    // Add event listener on flow
    const contract = new ethers.Contract(
      cfaAddress,
      // @ts-ignore
      sf.instance!.contracts.IConstantFlowAgreementV1.abi!,
      provider,
    );
    contract.on('FlowUpdated', (token, sender, receiver, flowRate) => {
      const flowRateInt = Number.parseInt(flowRate);
      const event = new Event();
      event.set('from', sender);
      event.set('to', receiver);

      if (flowRateInt > 0) {
        startFlow(sender, Number.parseInt(flowRate));
        addViewer(sender);
        event.set('type', EventType.JOIN);
      } else {
        stopFlow(sender);
        removeViewer(sender);
        event.set('type', EventType.LEAVE);
      }
      event.save().catch((error) => console.error(`Error saving event to the DB: ${error}`));
    });
    return () => stopAllFlow();
  }, []);

  if (isNil(address)) {
    return null;
  }

  return (
    <Container>
      <Chip
        avatar={<GroupOutlinedIcon height={18} />}
        variant="outlined"
        label={`${viewersCount} viewers`}
      />
      <Chip
        avatar={<StyledDaiIcon height={18} />}
        label={currentDeposit.toFixed(2)}
        variant="outlined"
      />
    </Container>
  );
};

const Container = styled(Box)`
  > div:not(:first-child) {
    margin-left: 16px;
  }
`;

const StyledDaiIcon = styled(DaiIcon)`
  border-radius: 9px;
  rect {
    rx: 200px;
    ry: 200px;
  }
`;
