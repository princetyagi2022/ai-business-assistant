const FILTERABLE_KEY_PATTERN = /(status|type|category|department|role|region|segment|priority|source|channel|payment|method)/i;

export const inferFilterConfigs = (rows = [], keys = []) => {
  const candidateKeys = keys.length
    ? keys
    : Object.keys(rows[0] || {}).filter((key) => key !== 'id');

  return candidateKeys
    .filter((key) => {
      if (!FILTERABLE_KEY_PATTERN.test(key)) return false;
      const values = rows
        .map((row) => row?.[key])
        .filter((value) => value !== null && value !== undefined && value !== '');
      const uniqueCount = new Set(values.map(String)).size;
      return uniqueCount > 1 && uniqueCount <= 20;
    })
    .slice(0, 4)
    .map((key) => ({
      id: key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
    }));
};

export default inferFilterConfigs;
