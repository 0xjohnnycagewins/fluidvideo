import { Column } from 'components/base/column';
import { LoginForm } from 'components/login/login-form';
import React from 'react';
import styled from 'styled-components';

export const LoginContainer: React.FunctionComponent = () => {
  return (
    <StyledColumn>
      <StyledForm />
    </StyledColumn>
  );
};

const StyledColumn = styled(Column)`
  border: black 2px;
  border-radius: 15px;
  margin: 10px;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
const StyledForm = styled(LoginForm)`
  height: 500px;
`;
