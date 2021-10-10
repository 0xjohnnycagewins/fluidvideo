import { useMoralis } from 'react-moralis';

export const useUserAddress = (): string | undefined => {
  const { user } = useMoralis();
  return user?.get('ethAddress');
};
