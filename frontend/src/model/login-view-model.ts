import * as yup from 'yup';

export interface LoginViewModel {
  username: string;
  password: string;
}

/*
 * Schema for the form
 */
export const loginSchema = () =>
  yup.object().shape({
    username: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required(),
  });
