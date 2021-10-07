import { TextField } from '@mui/material';
import { BaseTextFieldProps } from '@mui/material/TextField/TextField';
import { useField } from 'formik';
import React from 'react';

interface Props extends BaseTextFieldProps {
  name: string;
  title?: string;
  variant: 'standard' | 'outlined' | 'filled' | undefined;
}

export const FormikTextField: React.FunctionComponent<Props> = ({
  name,
  title,
  variant = 'outlined',
  ...rest
}) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      fullWidth
      id={name}
      name={name}
      label={title}
      value={field.value}
      onChange={field.onChange}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      variant={variant}
      {...rest}
    />
  );
};
