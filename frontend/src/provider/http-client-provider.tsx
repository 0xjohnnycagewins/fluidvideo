import { Axios } from 'axios';
import React from 'react';

// TODO create a wrapper to be able to inject mocks
const httpClientContext = React.createContext<Axios | undefined>(undefined);

interface Props {
  client: Axios; // TODO use wrapper here
}

export const HttpClientProvider: React.FunctionComponent<Props> = ({ client, children }) => {
  return <httpClientContext.Provider value={client}>{children}</httpClientContext.Provider>;
};

export const useHttpClient = (): Axios => {
  const httpClient = React.useContext(httpClientContext);
  if (!httpClient) {
    throw new Error('useHttpClient must be used within httpClientProvider.');
  }
  return httpClient;
};
