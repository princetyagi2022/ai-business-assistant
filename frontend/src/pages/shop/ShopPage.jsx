import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  Badge,
  Drawer,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  Stack,
  Alert,
  Snackbar,
  Paper,
  InputAdornment,
  Tooltip,
  Rating,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BoltIcon from '@mui/icons-material/Bolt';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import storefrontService from '@/services/storefrontService';
import { formatCurrency } from '@/utils/formatters';

// Clean standard SVG data URL placeholder so it works flawlessly anywhere without external domain loading blocks
const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" viewBox="0 0 200 180"><rect width="100%" height="100%" fill="%232a2a2a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23666">No Image Available</text></svg>`;

// Compact number formatting for review counts, e.g. 15234 -> 15.2k
const formatCompact = (value) => {
  const num = Number(value) || 0;
  if (num >= 1000) {
    const thousands = num / 1000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}k`;
  }
  return `${num}`;
};

// Percentage discount off the MRP (list price), rounded down.
const discountPercent = (price, mrp) => {
  const p = Number(price) || 0;
  const m = Number(mrp) || 0;
  if (m <= p || m <= 0) return 0;
  return Math.round(((m - p) / m) * 100);
};

const ShopPage = () => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({}); // productId -> { product, quantity }
  const [cartOpen, setCartOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storefrontService.getCatalog();
      setCatalog(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = useMemo(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems]);
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),
    [cartItems],
  );

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      const quantity = existing ? existing.quantity + 1 : 1;
      if (quantity > product.stock) {
        setToast({ severity: 'warning', message: `Only ${product.stock} in stock for ${product.name}` });
        return prev;
      }
      if (!existing) {
        setToast({ severity: 'success', message: `${product.name} added to cart.` });
      }
      return { ...prev, [product.id]: { product, quantity } };
    });
  };

  const changeQuantity = (productId, delta) => {
    setCart((prev) => {
      const entry = prev[productId];
      if (!entry) return prev;
      const quantity = entry.quantity + delta;
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[productId];
        setToast({ severity: 'info', message: `${entry.product.name} removed.` });
        return next;
      }
      if (quantity > entry.product.stock) {
        setToast({ severity: 'warning', message: `Only ${entry.product.stock} available.` });
        return prev;
      }
      return { ...prev, [productId]: { ...entry, quantity } };
    });
  };

  const removeItem = (productId) => {
    setCart((prev) => {
      const next = { ...prev };
      const productName = next[productId]?.product?.name;
      delete next[productId];
      if (productName) {
        setToast({ severity: 'info', message: `${productName} removed from cart.` });
      }
      return next;
    });
  };

  const placeOrder = async () => {
    if (!cartItems.length) return;
    if (!shippingAddress.trim()) {
        setToast({ severity: 'error', message: 'Please provide a shipping address.' });
        return;
    }
    setPlacing(true);
    try {
      const payload = {
        shippingAddress,
        items: cartItems.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      };
      const order = await storefrontService.placeOrder(payload);
      setCart({});
      setShippingAddress('');
      setCartOpen(false);
      setToast({ severity: 'success', message: `Order ${order?.orderNumber || ''} placed successfully!` });
      loadCatalog(); // refresh stock
    } catch (err) {
      setToast({ severity: 'error', message: err.response?.data?.message || 'Failed to place order' });
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Loader message="Loading products…" />;
  if (error) return <ErrorState message={error} onRetry={loadCatalog} />;

  const categoriesWithProducts = catalog.filter(group => (group.products || []).length > 0);
  const hasProducts = categoriesWithProducts.length > 0;
  const categoryNames = categoriesWithProducts.map((g) => g.category);
  const totalProductCount = categoriesWithProducts.reduce((sum, g) => sum + (g.products || []).length, 0);

  const sortProducts = (products) => {
    const list = [...products];
    switch (sortBy) {
      case 'priceLow':
        return list.sort((a, b) => Number(a.price) - Number(b.price));
      case 'priceHigh':
        return list.sort((a, b) => Number(b.price) - Number(a.price));
      case 'rating':
        return list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
      case 'discount':
        return list.sort((a, b) => discountPercent(b.price, b.mrp) - discountPercent(a.price, a.mrp));
      default:
        return list;
    }
  };

  const matchesSearch = (p) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
  };

  // Groups to display after applying category filter, search, and sort.
  const displayGroups = categoriesWithProducts
    .filter((group) => selectedCategory === 'all' || group.category === selectedCategory)
    .map((group) => ({
      category: group.category,
      products: sortProducts((group.products || []).filter(matchesSearch)),
    }))
    .filter((group) => group.products.length > 0);

  const noResults = hasProducts && displayGroups.length === 0;

  const headerActions = (
    <Button
      variant="contained"
      color="primary"
      size={isMobile ? 'medium' : 'large'}
      sx={{
        borderRadius: 2,
        px: { xs: 2, sm: 3 },
        fontWeight: 'bold',
        textTransform: 'none',
        boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
      }}
      startIcon={(
        <Badge badgeContent={cartCount} color="error" overlap="circular">
          <ShoppingCartIcon />
        </Badge>
      )}
      onClick={() => setCartOpen(true)}
    >
      {isMobile ? formatCurrency(cartTotal) : `My Cart (${formatCurrency(cartTotal)})`}
    </Button>
  );

  // Product card renderer. This is a plain function (not a nested React
  // component) so that typing in the search or cart fields does not give it a
  // new identity and remount every card on each keystroke.
  const renderProductCard = (product) => {
    const discount = discountPercent(product.price, product.mrp);
    const rating = Number(product.rating) || 0;
    return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          transform: 'translateY(-4px)',
          borderColor: 'primary.main',
        },
        position: 'relative'
      }}
    >
      {discount > 0 && (
        <Chip
          size="small"
          icon={<LocalOfferIcon sx={{ fontSize: 14 }} />}
          label={`${discount}% OFF`}
          color="error"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1,
            fontWeight: 'bold',
            '& .MuiChip-icon': { color: 'inherit' }
          }}
        />
      )}
      <Tooltip title="Save for Later">
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'action.hover',
            backdropFilter: 'blur(4px)',
            zIndex: 1
          }}
        >
          <FavoriteBorderIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        </IconButton>
      </Tooltip>

      <CardMedia
        component="img"
        image={product.imageUrl || PLACEHOLDER_SVG}
        alt={product.name}
        onError={(e) => { e.target.src = PLACEHOLDER_SVG; }}
        sx={{
          height: { xs: 150, sm: 180, md: 200 },
          objectFit: 'cover',
          backgroundColor: 'action.hover',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: { xs: 1.25, sm: 2 }, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          {product.category} · {product.sku}
        </Typography>
        <Typography variant="subtitle1" fontWeight={700} sx={{
          mb: 1,
          height: '2.6em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.3,
          color: 'text.primary'
        }}>
          {product.name}
        </Typography>

        {rating > 0 && (
          <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 1, rowGap: 0.25 }}>
            <Rating value={rating} precision={0.1} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">
              {rating.toFixed(1)} ({formatCompact(product.reviewCount)})
            </Typography>
          </Stack>
        )}

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 1.5, rowGap: 0.5 }}>
          <Chip
            size="small"
            label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            color={product.stock > 0 ? 'success' : 'default'}
            variant={product.stock > 0 ? 'filled' : 'outlined'}
            sx={{ fontWeight: 'bold' }}
          />
          {product.stock > 0 && product.stock <= 10 && (
            <Chip size="small" color="warning" variant="outlined" label="Only a few left" />
          )}
        </Stack>

        <Box sx={{ mt: 'auto' }}>
          <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap">
            <Typography variant="h6" color="primary.main" fontWeight={800} sx={{ fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
              {formatCurrency(product.price)}
            </Typography>
            {discount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                {formatCurrency(product.mrp)}
              </Typography>
            )}
          </Stack>
          {discount > 0 && (
            <Typography variant="caption" color="success.main" fontWeight={700}>
              You save {formatCurrency(Number(product.mrp) - Number(product.price))}
            </Typography>
          )}
        </Box>
      </CardContent>

      <Box sx={{ p: { xs: 1.25, sm: 2 }, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          disabled={product.stock <= 0}
          onClick={() => addToCart(product)}
          sx={{
            borderRadius: 2,
            fontWeight: 'bold',
            textTransform: 'none',
          }}
        >
          {product.stock > 0 ? 'Add to cart' : 'Out of Stock'}
        </Button>
      </Box>
    </Card>
    );
  };

  // Cart drawer renderer. Kept as a plain function (not a nested component) so
  // the shipping-address field stays mounted while typing instead of losing
  // focus after every character.
  const renderCartDrawer = () => (
    <Drawer
      anchor="right"
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: 'background.paper',
          color: 'text.primary'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ShoppingCartIcon color="primary" />
          <Typography variant="h6" fontWeight={800} color="text.primary">
            Your Shopping Cart
          </Typography>
          <Chip label={`${cartCount} items`} size="small" color="primary" sx={{ ml: 1, fontWeight: 'bold' }} />
        </Stack>
        <IconButton onClick={() => setCartOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {cartItems.length === 0 ? (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 4, textAlign: 'center' }}>
          <EmptyState
            icon={ShoppingCartIcon}
            title="Your cart is empty"
            description="Looks like you haven't added anything to your cart yet."
          />
          <Button variant="outlined" color="primary" sx={{ mt: 3, textTransform: 'none', borderRadius: 2 }} onClick={() => setCartOpen(false)}>
             Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
            {cartItems.map(({ product, quantity }) => (
              <ListItem
                key={product.id}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  alignItems: 'flex-start',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <Paper variant="outlined" sx={{ width: 60, height: 60, p: 0.5, mr: 2, flexShrink: 0, backgroundColor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img 
                    src={product.imageUrl || PLACEHOLDER_SVG} 
                    alt={product.name} 
                    onError={(e) => { e.target.src = PLACEHOLDER_SVG; }} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  />
                </Paper>

                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={700} sx={{
                        lineHeight: 1.2,
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        color: 'text.primary'
                    }}>
                        {product.name}
                    </Typography>
                  }
                  secondary={
                    <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">SKU: {product.sku}</Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                                {formatCurrency(product.price * quantity)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                ({formatCurrency(product.price)} / unit)
                            </Typography>
                        </Stack>
                    </Stack>
                  }
                  sx={{ mr: 1, my: 0 }}
                />

                <Stack spacing={1} alignItems="flex-end" sx={{ flexShrink: 0, ml: 'auto' }}>
                    <IconButton size="small" color="error" onClick={() => removeItem(product.id)} sx={{ p: 0.5 }}>
                        <DeleteForeverIcon fontSize="small" />
                    </IconButton>

                    <Paper
                        variant="outlined"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 1,
                            borderColor: 'divider',
                            overflow: 'hidden',
                            width: 100,
                            justifyContent: 'space-between',
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <IconButton size="small" onClick={() => changeQuantity(product.id, -1)} sx={{ borderRadius: 0, p: 0.5 }}>
                            <RemoveIcon fontSize="inherit" />
                        </IconButton>
                        <Typography variant="body2" fontWeight="bold" sx={{ width: 30, textAlign: 'center', color: 'text.primary' }}>{quantity}</Typography>
                        <IconButton size="small" onClick={() => changeQuantity(product.id, 1)} sx={{ borderRadius: 0, p: 0.5 }}>
                            <AddIcon fontSize="inherit" />
                        </IconButton>
                    </Paper>
                </Stack>
              </ListItem>
            ))}
          </List>

          <Paper elevation={3} sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', mt: 'auto', backgroundColor: 'background.paper' }}>
            <Typography variant="subtitle1" fontWeight={800} gutterBottom color="text.primary">
                Order Summary
            </Typography>
            <Stack spacing={1} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Subtotal ({cartCount} items)</Typography>
                    <Typography variant="body2" fontWeight={600} color="text.primary">{formatCurrency(cartTotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Shipping</Typography>
                    <Typography variant="body2" color="success.main" fontWeight={600}>FREE</Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={800} color="text.primary">Total Amount</Typography>
                    <Typography variant="h6" fontWeight={800} color="primary.main">
                        {formatCurrency(cartTotal)}
                    </Typography>
                </Stack>
            </Stack>

            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, mt: 2 }} color="text.primary">
                Shipping Address
            </Typography>
            <TextField
              placeholder="Enter complete shipping address..."
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              size="small"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              sx={{ mb: 3 }}
              error={cartItems.length > 0 && !shippingAddress.trim()}
              helperText={cartItems.length > 0 && !shippingAddress.trim() ? "Required for checkout" : ""}
            />

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              startIcon={<ChevronRightIcon />}
              disabled={placing || cartItems.length === 0}
              onClick={placeOrder}
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 14px 0 rgba(255,193,7,0.3)',
              }}
            >
              {placing ? 'Processing Order…' : `Proceed to Checkout`}
            </Button>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ textAlign: 'center', mt: 1.5 }}>
                By proceeding, you agree to our Terms and Conditions.
            </Typography>
          </Paper>
        </>
      )}
    </Drawer>
  );

  return (
    <Box sx={{ color: 'text.primary' }}>
      <PageHeader
        title="AI Business Assistant Store"
        subtitle="Browse products in stock and place your order instantly"
        actions={headerActions}
      />

      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          color: '#fff',
          background: 'linear-gradient(135deg, #131921 0%, #232f3e 55%, #37475a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <BoltIcon sx={{ color: '#febd69' }} />
          <Typography variant="overline" sx={{ letterSpacing: 2, color: '#febd69', fontWeight: 700 }}>
            Great Indian Deals
          </Typography>
        </Stack>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={800} gutterBottom>
          Everything you need, delivered fast
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 620 }}>
          Explore {totalProductCount}+ products across {categoryNames.length} categories with unbeatable prices,
          genuine ratings and free shipping on every order.
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }} flexWrap="wrap" useFlexGap>
          <Chip label="Free Delivery" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }} />
          <Chip label="Secure Checkout" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }} />
          <Chip label="Easy Returns" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }} />
        </Stack>
      </Paper>

      <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 4, borderRadius: 3, backgroundColor: 'background.paper', position: 'sticky', top: 8, zIndex: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField
              variant="outlined"
              size="small"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 220 }}
              InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                          <SearchIcon color="action" />
                      </InputAdornment>
                  ),
              }}
          />
          <TextField
              select
              size="small"
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: 200 }}
          >
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="priceLow">Price: Low to High</MenuItem>
              <MenuItem value="priceHigh">Price: High to Low</MenuItem>
              <MenuItem value="rating">Customer Rating</MenuItem>
              <MenuItem value="discount">Biggest Discount</MenuItem>
          </TextField>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pt: 2, pb: 0.5, alignItems: 'center' }}>
            <Chip
              label="All Products"
              variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
              color={selectedCategory === 'all' ? 'primary' : 'default'}
              size="small"
              clickable
              onClick={() => setSelectedCategory('all')}
            />
            {categoryNames.map((name) => (
                <Chip
                  key={name}
                  label={name}
                  variant={selectedCategory === name ? 'filled' : 'outlined'}
                  color={selectedCategory === name ? 'primary' : 'default'}
                  size="small"
                  clickable
                  onClick={() => setSelectedCategory(name)}
                />
            ))}
        </Stack>
      </Paper>

      {!hasProducts ? (
        <EmptyState
          icon={StorefrontIcon}
          title="Storefront is empty"
          description="There are currently no products available in stock. Please check back later."
        />
      ) : noResults ? (
        <EmptyState
            icon={SearchIcon}
            title="No products found"
            description={`We couldn't find any products matching your filters. Try a different search or category.`}
        />
      ) : (
        displayGroups.map((group) => (
            <Box key={group.category} sx={{ mb: 6 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }} flexWrap="wrap" useFlexGap>
                <Typography variant="h5" fontWeight={800} sx={{ color: 'text.primary', letterSpacing: '-0.5px', fontSize: { xs: '1.15rem', sm: '1.5rem' } }}>
                  {group.category}
                </Typography>
                <Chip label={`${group.products.length} Products`} size="small" color="default" sx={{ borderRadius: 1 }} />
                <Divider sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} />
              </Stack>

              <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                {group.products.map((product) => (
                  <Grid item xs={6} sm={4} md={3} lg={3} key={product.id}>
                    {renderProductCard(product)}
                  </Grid>
                ))}
              </Grid>
            </Box>
        ))
      )}

      {renderCartDrawer()}

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast && (
          <Alert severity={toast.severity} onClose={() => setToast(null)} variant="filled" sx={{ borderRadius: 2, fontWeight: 'bold' }}>
            {toast.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default ShopPage;