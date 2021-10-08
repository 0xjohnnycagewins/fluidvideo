import { Button, TextField } from '@mui/material';
import { Column } from 'components/base/column';
import React from 'react';
import styled from 'styled-components';

export const LoginForm: React.FunctionComponent = () => {
  return (
    <StyledForm>
      <Column>
        <TextField name="username" label="email" variant="outlined" />
        <TextField name="password" label="password" variant="outlined" type={'password'} />
        <Button variant="outlined">Login</Button>
      </Column>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  flex: 1;
  padding: 0;
`;
