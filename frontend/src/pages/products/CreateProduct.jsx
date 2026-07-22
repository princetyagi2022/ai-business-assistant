import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card,
  CardContent,
  Button,
  Alert,
  Box,
  Grid,
  Typography,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import FormTextField from '@/components/forms/FormTextField';
import { productFormSchema } from '@/utils/validators';
import { formatCurrency } from '@/utils/formatters';
import productService from '@/services/productService';

const PLACEHOLDER_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" fill="#eceff1"/><text x="50%" y="50%" font-family="sans-serif" font-size="12" fill="#90a4ae" text-anchor="middle" dominant-baseline="middle">No image</text></svg>',
  );

const CreateProduct = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [categorySuggestions, setCategorySuggestions] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(productFormSchema),
    defaultValues: {
      name: '',
      category: '',
      price: '',
      discountPercent: '',
      stock: '',
      imageUrl: '',
      description: '',
    },
  });

  // Offer the categories that already exist so products stay grouped consistently.
  useEffect(() => {
    let active = true;
    productService
      .getAll()
      .then((data) => {
        if (!active) return;
        const rows = Array.isArray(data) ? data : data?.items || [];
        const names = [...new Set(rows.map((row) => row.category).filter(Boolean))].sort();
        setCategorySuggestions(names);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const price = watch('price');
  const discountPercent = watch('discountPercent');
  const imageUrl = watch('imageUrl');

  // Mirror the backend: original (list) price = selling price / (1 - discount/100).
  const preview = useMemo(() => {
    const p = Number(price) || 0;
    const d = Number(discountPercent) || 0;
    if (p <= 0) return null;
    const original = d > 0 && d < 100 ? p / (1 - d / 100) : p;
    return { selling: p, original, discount: d > 0 && d < 100 ? Math.round(d) : 0 };
  }, [price, discountPercent]);

  const onSubmit = async (values) => {
    setError('');
    try {
      await productService.create(values);
      setSuccess(true);
      setTimeout(() => navigate('/products'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product.');
    }
  };

  return (
    <>
      <PageHeader
        title="Add Product"
        subtitle="New products go live in the shop as soon as they have stock"
        breadcrumbs={[{ label: 'Products', to: '/products' }, { label: 'Add' }]}
      />
      <Card sx={{ maxWidth: 820 }}>
        <CardContent>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Product added successfully — it is now live in the shop.
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <FormTextField name="name" control={control} label="Product name" />

                <FormTextField name="category" control={control} label="Category" />
                {categorySuggestions.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {categorySuggestions.map((name) => (
                      <Chip
                        key={name}
                        label={name}
                        size="small"
                        variant="outlined"
                        onClick={() => setValue('category', name, { shouldValidate: true })}
                      />
                    ))}
                  </Stack>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      name="price"
                      control={control}
                      label="Selling price (₹)"
                      type="number"
                      inputProps={{ min: 0, step: '0.01' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      name="discountPercent"
                      control={control}
                      label="Discount %"
                      type="number"
                      inputProps={{ min: 0, max: 99, step: '1' }}
                    />
                  </Grid>
                </Grid>

                <FormTextField
                  name="stock"
                  control={control}
                  label="Stock quantity"
                  type="number"
                  inputProps={{ min: 0, step: '1' }}
                />
                <FormTextField name="imageUrl" control={control} label="Image URL" />
                <FormTextField
                  name="description"
                  control={control}
                  label="Description"
                  multiline
                  minRows={3}
                />
              </Grid>

              <Grid item xs={12} sm={5}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Shop preview
                </Typography>
                <Card variant="outlined">
                  <Box
                    component="img"
                    src={imageUrl?.trim() || PLACEHOLDER_IMG}
                    alt="Product preview"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMG;
                    }}
                    sx={{ width: '100%', height: 200, objectFit: 'contain', bgcolor: 'grey.50' }}
                  />
                  <Divider />
                  <CardContent>
                    {preview ? (
                      <Stack direction="row" spacing={1} alignItems="baseline">
                        <Typography variant="h6" fontWeight={700}>
                          {formatCurrency(preview.selling)}
                        </Typography>
                        {preview.discount > 0 && (
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              {formatCurrency(preview.original)}
                            </Typography>
                            <Chip label={`${preview.discount}% off`} size="small" color="success" />
                          </>
                        )}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Enter a price to preview shop pricing.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Add Product
              </Button>
              <Button variant="outlined" onClick={() => navigate('/products')}>
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default CreateProduct;
