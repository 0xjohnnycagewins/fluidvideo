import { bootstrapMoralis } from 'bootstrap';
import React, { useEffect } from 'react';

export const MoralisBootstrap: React.FunctionComponent = () => {
  useEffect(() => {
    bootstrapMoralis();
  }, []);
  return null;
};
