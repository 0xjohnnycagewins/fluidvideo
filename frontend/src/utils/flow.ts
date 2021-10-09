import dayjs from 'dayjs';

export const convertTokenToDai = (flowRate: number): number => (flowRate * 2592) / 1000000000000000;

export const getDeposit = (timestamp: Date, flowRate: number): number => {
  const startedTime = dayjs(timestamp);
  const diff = dayjs().diff(startedTime, 's');
  const daiRate = convertTokenToDai(flowRate);
  // TODO: Ask Superfluid guy for conversion
  return convertFlowRatePerMonthToSeconds(daiRate * diff);
};

export const convertFlowRatePerMonthToSeconds = (flowRate: number): number =>
  flowRate / (60 * 60 * 24 * 30);
export const convertFlowRatePerMonthToMinutes = (flowRate: number): number =>
  flowRate / (60 * 24 * 30);
export const convertFlowRatePerMonthToHours = (flowRate: number): number => flowRate / (24 * 30);
