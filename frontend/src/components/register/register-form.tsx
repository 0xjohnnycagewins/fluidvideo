import { Button } from '@mui/material';
import { Column } from 'components/base/column.component';
import { FormikTextField } from 'components/base/form/formik-textfield';
import { FormikProps, withFormik } from 'formik';
import { registerSchema, RegisterViewModel } from 'model/register-view-model';
import { isNil } from 'ramda';
import React from 'react';
import styled from 'styled-components';

interface RegisterFormValues extends RegisterViewModel {}

interface GeneralFormProps {
  onSubmit?: (viewModel: RegisterViewModel) => void;
}

export const RegisterForm = withFormik<GeneralFormProps, RegisterFormValues>({
  validationSchema: registerSchema(),
  handleSubmit: (values, formikBag) => {
    if (!isNil(formikBag.props.onSubmit)) {
      formikBag.props.onSubmit(values);
    }
  },
})((props: FormikProps<RegisterFormValues>) => {
  return (
    <StyledForm>
      <SpacedColumn>
        <FormikTextField name="username" title="username" variant="outlined" />
        <FormikTextField name="password" title="password" variant="outlined" type={'password'} />
        <Button variant="outlined" onClick={props.submitForm}>
          Register
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
