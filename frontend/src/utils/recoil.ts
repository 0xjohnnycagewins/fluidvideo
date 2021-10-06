import { isNil } from 'ramda';
import { atom, RecoilState } from 'recoil';

export enum StateKey {
  INJECTED_PROVIDER_CHAIN_ID = 'injectedProviderChainId',
  SUPERFLUID_INITIALIZED = 'superfluidInitialized',
  USER_ADDRESS = 'userAddress',
}

const atoms = new Map<string, RecoilState<any>>();

const getStateDefaultValue = (key: StateKey): any => {
  switch (key) {
    case StateKey.INJECTED_PROVIDER_CHAIN_ID:
      return 0;
    case StateKey.SUPERFLUID_INITIALIZED:
      return false;
    case StateKey.USER_ADDRESS:
      return '';
    default:
      throw Error('Recoil key not found');
  }
};

export const getAtom = <T>(key: StateKey): RecoilState<T> => {
  const state = atoms.get(key);
  if (isNil(state)) {
    const atomState = atom<T>({
      key,
      default: getStateDefaultValue(key),
    });
    atoms.set(key, atomState);
    return atomState;
  }
  return state;
};
