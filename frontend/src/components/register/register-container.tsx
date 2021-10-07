import { Link } from '@mui/material';
import { Column } from 'components/base/column.component';
import { RegisterForm } from 'components/register/register-form';
import React from 'react';
import styled from 'styled-components';

export const RegisterContainer: React.FunctionComponent = () => {
  return (
    <StyledColumn>
      <StyledForm />
      <PaddedLink href="/login" underline="always">
        {'Already have an account, login here'}
      </PaddedLink>
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
const StyledForm = styled(RegisterForm)`
  height: 500px;
`;

const PaddedLink = styled(Link)`
  padding-top: 20px;
`;
