export const getHistoryBlockString = (
  title: string,
  noLabel?: string,
  yesLabel?: string,
): string => {
  const parameters = {
    title: title,
    noLabel: noLabel,
    yesLabel: yesLabel,
  };
  return JSON.stringify(parameters);
};
