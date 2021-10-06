import { Button } from '@mui/material';
import React, { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { StateKey, getAtom } from 'utils/recoil';

export const SuperfluidButton: React.FunctionComponent = () => {
  const superfluidInitializedState = getAtom<boolean>(StateKey.SUPERFLUID_INITIALIZED);
  const superfluidInitialized = useRecoilValue(superfluidInitializedState);

  const startFlow = useCallback((): void => {
    console.log(`started flow`);
  }, []);

  if (!superfluidInitialized) {
    return null;
  }

  return <Button onClick={startFlow}>{'Start MOF(l)O(w)'}</Button>;
};
