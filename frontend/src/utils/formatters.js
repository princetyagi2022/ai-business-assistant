import dayjs from 'dayjs';
import { DATE_FORMAT, DATETIME_FORMAT } from './constants';

export const formatCurrency = (value, currency = 'USD') => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatNumber = (value, options = {}) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-US', options).format(num);
};

export const formatPercent = (value, decimals = 1) => {
  const num = Number(value) || 0;
  return `${num >= 0 ? '+' : ''}${num.toFixed(decimals)}%`;
};

export const formatDate = (value, format = DATE_FORMAT) => {
  if (!value) return '—';
  return dayjs(value).format(format);
};

export const formatDateTime = (value) => formatDate(value, DATETIME_FORMAT);

export const formatRelativeTime = (value) => {
  if (!value) return '—';
  const diff = dayjs().diff(dayjs(value), 'minute');
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return formatDate(value);
};

export const getInitials = (firstName = '', lastName = '') => {
  const a = (firstName[0] || '').toUpperCase();
  const b = (lastName[0] || '').toUpperCase();
  return `${a}${b}` || '?';
};

export const truncate = (text, max = 80) => {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}…` : text;
};
