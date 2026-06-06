import * as yup from 'yup';

export const emailSchema = yup
  .string()
  .trim()
  .email('Enter a valid email address')
  .required('Email is required');

export const passwordSchema = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required');

export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = yup.object({
  firstName: yup.string().trim().required('First name is required'),
  lastName: yup.string().trim().required('Last name is required'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export const forgotPasswordSchema = yup.object({
  email: emailSchema,
});

export const resetPasswordSchema = yup.object({
  token: yup.string().required('Reset token is required'),
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export const verifyEmailSchema = yup.object({
  email: emailSchema,
  code: yup
    .string()
    .length(6, 'Verification code must be 6 digits')
    .required('Verification code is required'),
});

export const userFormSchema = yup.object({
  firstName: yup.string().trim().required('First name is required'),
  lastName: yup.string().trim().required('Last name is required'),
  email: emailSchema,
  role: yup.string().required('Role is required'),
  status: yup.string().required('Status is required'),
});
