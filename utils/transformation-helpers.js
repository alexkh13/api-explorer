// Transformation utility functions for virtual endpoint context
// These are available as context.utils in virtual endpoint code

// ═══════════════════════════════════════════════════════════
// OBJECT UTILITIES
// ═══════════════════════════════════════════════════════════

export function merge(...objects) {
  return Object.assign({}, ...objects);
}

export function pick(obj, keys) {
  if (!obj) return {};
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}

export function omit(obj, keys) {
  if (!obj) return {};
  const keysSet = new Set(keys);
  return Object.keys(obj).reduce((acc, key) => {
    if (!keysSet.has(key)) acc[key] = obj[key];
    return acc;
  }, {});
}

export function mapKeys(obj, fn) {
  if (!obj) return {};
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[fn(key, value)] = value;
    return acc;
  }, {});
}

export function mapValues(obj, fn) {
  if (!obj) return {};
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = fn(value, key);
    return acc;
  }, {});
}

export function renameKeys(obj, mapping) {
  if (!obj) return {};
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[mapping[key] || key] = value;
    return acc;
  }, {});
}

export function filterObject(obj, predicate) {
  if (!obj) return {};
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (predicate(value, key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function deepMerge(...objects) {
  const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);

  return objects.reduce((acc, obj) => {
    Object.keys(obj).forEach(key => {
      if (isObject(obj[key]) && isObject(acc[key])) {
        acc[key] = deepMerge(acc[key], obj[key]);
      } else {
        acc[key] = obj[key];
      }
    });
    return acc;
  }, {});
}

export function get(obj, path, defaultValue = undefined) {
  if (!obj) return defaultValue;

  const keys = Array.isArray(path) ? path : path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

export function set(obj, path, value) {
  if (!obj) return obj;

  const keys = Array.isArray(path) ? path : path.split('.');
  const lastKey = keys.pop();

  let current = obj;
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
  return obj;
}

// ═══════════════════════════════════════════════════════════
// ARRAY UTILITIES
// ═══════════════════════════════════════════════════════════

export function groupBy(arr, key) {
  if (!Array.isArray(arr)) return {};

  return arr.reduce((acc, item) => {
    const group = typeof key === 'function' ? key(item) : get(item, key);
    (acc[group] = acc[group] || []).push(item);
    return acc;
  }, {});
}

export function sortBy(arr, key, order = 'asc') {
  if (!Array.isArray(arr)) return [];

  return [...arr].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : get(a, key);
    const bVal = typeof key === 'function' ? key(b) : get(b, key);

    if (aVal === bVal) return 0;

    const comparison = aVal > bVal ? 1 : -1;
    return order === 'asc' ? comparison : -comparison;
  });
}

export function uniqBy(arr, key) {
  if (!Array.isArray(arr)) return [];

  const seen = new Set();
  return arr.filter(item => {
    const val = typeof key === 'function' ? key(item) : get(item, key);
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export function flatten(arr, depth = Infinity) {
  if (!Array.isArray(arr)) return [];
  return arr.flat(depth);
}

export function chunk(arr, size) {
  if (!Array.isArray(arr)) return [];

  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function partition(arr, predicate) {
  if (!Array.isArray(arr)) return [[], []];

  return arr.reduce(
    ([pass, fail], item) => {
      return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
    },
    [[], []]
  );
}

// ═══════════════════════════════════════════════════════════
// STRING UTILITIES
// ═══════════════════════════════════════════════════════════

export function camelCase(str) {
  if (!str) return '';
  return str
    .replace(/[_-](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}

export function snakeCase(str) {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

export function kebabCase(str) {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(str, length, suffix = '...') {
  if (!str || str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

// ═══════════════════════════════════════════════════════════
// DATE UTILITIES
// ═══════════════════════════════════════════════════════════

export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  if (isNaN(d)) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

export function parseDate(str) {
  return new Date(str);
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function diffDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function isToday(date) {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function isAfter(date1, date2) {
  return new Date(date1) > new Date(date2);
}

// ═══════════════════════════════════════════════════════════
// VALIDATION UTILITIES
// ═══════════════════════════════════════════════════════════

export function isEmail(str) {
  if (!str) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

export function isUrl(str) {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function isEmpty(val) {
  if (val == null) return true;
  if (typeof val === 'string' || Array.isArray(val)) return val.length === 0;
  if (typeof val === 'object') return Object.keys(val).length === 0;
  return false;
}

export function isNumeric(val) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}

// ═══════════════════════════════════════════════════════════
// DATA TRANSFORMATION UTILITIES
// ═══════════════════════════════════════════════════════════

export function jsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

export function jsonStringify(obj, pretty = false) {
  try {
    return JSON.stringify(obj, null, pretty ? 2 : 0);
  } catch {
    return '';
  }
}

export function base64Encode(str) {
  try {
    return btoa(str);
  } catch {
    return '';
  }
}

export function base64Decode(str) {
  try {
    return atob(str);
  } catch {
    return '';
  }
}

export function hash(str) {
  // Simple hash function for cache keys
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// ═══════════════════════════════════════════════════════════
// HTTP UTILITIES
// ═══════════════════════════════════════════════════════════

export function buildUrl(base, params = {}) {
  let url = base;

  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, encodeURIComponent(value));
  });

  return url;
}

export function parseQueryString(str) {
  if (!str) return {};

  const params = new URLSearchParams(str.startsWith('?') ? str.slice(1) : str);
  const result = {};

  for (const [key, value] of params) {
    result[key] = value;
  }

  return result;
}

export function buildQueryString(obj) {
  if (!obj || Object.keys(obj).length === 0) return '';
  return new URLSearchParams(obj).toString();
}

// ═══════════════════════════════════════════════════════════
// MATH UTILITIES
// ═══════════════════════════════════════════════════════════

export function sum(arr, key) {
  if (!Array.isArray(arr)) return 0;

  if (key) {
    return arr.reduce((sum, item) => sum + (get(item, key) || 0), 0);
  }

  return arr.reduce((sum, val) => sum + (val || 0), 0);
}

export function avg(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return sum(arr, key) / arr.length;
}

export function min(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;

  if (key) {
    return Math.min(...arr.map(item => get(item, key) || 0));
  }

  return Math.min(...arr);
}

export function max(arr, key) {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;

  if (key) {
    return Math.max(...arr.map(item => get(item, key) || 0));
  }

  return Math.max(...arr);
}

export function round(num, decimals = 0) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

// ═══════════════════════════════════════════════════════════
// EXPORT ALL AS SINGLE OBJECT
// ═══════════════════════════════════════════════════════════

export const transformationHelpers = {
  // Object utilities
  merge,
  pick,
  omit,
  mapKeys,
  mapValues,
  renameKeys,
  filterObject,
  deepMerge,
  get,
  set,

  // Array utilities
  groupBy,
  sortBy,
  uniqBy,
  flatten,
  chunk,
  partition,

  // String utilities
  camelCase,
  snakeCase,
  kebabCase,
  capitalize,
  slugify,
  truncate,

  // Date utilities
  formatDate,
  parseDate,
  addDays,
  diffDays,
  isToday,
  isAfter,

  // Validation
  isEmail,
  isUrl,
  isEmpty,
  isNumeric,

  // Data transformation
  jsonParse,
  jsonStringify,
  base64Encode,
  base64Decode,
  hash,

  // HTTP utilities
  buildUrl,
  parseQueryString,
  buildQueryString,

  // Math utilities
  sum,
  avg,
  min,
  max,
  round
};
