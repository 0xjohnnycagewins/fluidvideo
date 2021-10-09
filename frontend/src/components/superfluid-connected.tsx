import React from 'react';
import { useRecoilValue } from 'recoil';
import { getAtom, StateKey } from 'utils/recoil';

export const SuperfluidConnected: React.FunctionComponent = ({ children }) => {
  const superfluidInitializedState = getAtom<boolean>(StateKey.SUPERFLUID_INITIALIZED);
  const superfluidInitialized = useRecoilValue(superfluidInitializedState);

  if (superfluidInitialized) {
    return <>{children}</>;
  }
  return null;
};
