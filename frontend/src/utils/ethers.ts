import { ExternalProvider } from '@ethersproject/providers/src.ts/web3-provider';

export interface ExternalProviderWithEvents extends ExternalProvider {
  disconnect: VoidFunction;
  on: (eventName: string, params: any) => void;
}
