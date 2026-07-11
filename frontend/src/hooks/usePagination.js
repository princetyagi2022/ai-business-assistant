import { useState, useMemo, useCallback, useEffect } from 'react';
import { PAGINATION_DEFAULTS } from '@/utils/constants';

export const usePagination = ({
  totalItems = 0,
  initialPage = PAGINATION_DEFAULTS.page,
  initialSize = PAGINATION_DEFAULTS.size,
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / size)),
    [totalItems, size],
  );

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages - 1));
  }, [totalPages]);

  const goToPage = useCallback(
    (next) => {
      setPage(Math.max(0, Math.min(next, totalPages - 1)));
    },
    [totalPages],
  );

  const nextPage = useCallback(() => goToPage(page + 1), [goToPage, page]);
  const prevPage = useCallback(() => goToPage(page - 1), [goToPage, page]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setSize(initialSize);
  }, [initialPage, initialSize]);

  return {
    page,
    size,
    totalPages,
    totalItems,
    setPage: goToPage,
    setSize: (newSize) => {
      setSize(Number(newSize));
      setPage(0);
    },
    nextPage,
    prevPage,
    reset,
    offset: page * size,
    hasNext: page < totalPages - 1,
    hasPrev: page > 0,
  };
};

export default usePagination;
