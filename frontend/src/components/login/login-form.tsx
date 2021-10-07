import { Button, TextField } from '@mui/material';
import { Column } from 'components/base/column.component';
import { FormikTextField } from 'components/base/form/formik-textfield';
import { FormikProps, withFormik } from 'formik';
import { loginSchema, LoginViewModel } from 'model/login-view-model';
import { isNil } from 'ramda';
import React from 'react';
import styled from 'styled-components';

interface LoginFormValues extends LoginViewModel {}

interface GeneralFormProps {
  onSubmit?: (viewModel: LoginViewModel) => void;
}

export const LoginForm = withFormik<GeneralFormProps, LoginFormValues>({
  validationSchema: loginSchema(),
  handleSubmit: (values, formikBag) => {
    if (!isNil(formikBag.props.onSubmit)) {
      formikBag.props.onSubmit(values);
    }
  },
})((props: FormikProps<LoginFormValues>) => {
  return (
    <StyledForm>
      <SpacedColumn>
        <FormikTextField name="username" title="username" variant="outlined" />
        <FormikTextField name="password" title="password" variant="outlined" type={'password'} />
        <Button variant="outlined" onClick={props.submitForm}>
          Login
        </Button>
      </SpacedColumn>
    </StyledForm>
  );
});

const StyledForm = styled.form`
  flex: 1;
  padding: 0;
`;

const SpacedColumn = styled(Column)`
  & > :not(:last-child) {
    margin-bottom: 10px;
  }
`;
