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
  email: yup
    .string()
    .trim()
    .required('Email or username is required'),
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
  phone: yup.string().trim().nullable(),
  role: yup.string().required('Role is required'),
  status: yup.string().required('Status is required'),
  password: yup.string().nullable(),
});

const emptyToNull = (value, original) => (String(original).trim() === '' ? null : value);

export const productFormSchema = yup.object({
  name: yup.string().trim().required('Product name is required'),
  category: yup.string().trim().required('Category is required'),
  price: yup
    .number()
    .typeError('Enter a valid price')
    .positive('Price must be greater than 0')
    .required('Selling price is required'),
  discountPercent: yup
    .number()
    .typeError('Enter a valid discount')
    .min(0, 'Discount cannot be negative')
    .max(99, 'Discount must be less than 100')
    .nullable()
    .transform(emptyToNull),
  stock: yup
    .number()
    .typeError('Enter a valid stock quantity')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .required('Stock quantity is required'),
  imageUrl: yup
    .string()
    .trim()
    .url('Enter a valid image URL')
    .nullable()
    .transform(emptyToNull),
  description: yup.string().trim().nullable(),
});
