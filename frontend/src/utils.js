const imageModules = import.meta.glob('./assets/images/**/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
});

const imageModuleLookup = Object.fromEntries(
  Object.entries(imageModules).map(([key, value]) => [key.toLowerCase(), value])
);

const placeholderSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <rect width="640" height="480" rx="40" fill="#f8fafc"/>
  <circle cx="320" cy="190" r="80" fill="#fee2e2"/>
  <text x="320" y="205" text-anchor="middle" font-size="64">🛒</text>
  <text x="320" y="310" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#64748b">FreshCart</text>
</svg>
`);

export const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${placeholderSvg}`;

export function getAssetImage(path) {
  if (!path) return FALLBACK_IMAGE;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/')) return path;
  const imageKey = `./assets/images/${path}`;
  return imageModules[imageKey] || imageModuleLookup[imageKey.toLowerCase()] || FALLBACK_IMAGE;
}

export function canDisplayProductImage(path) {
  return getAssetImage(path) !== FALLBACK_IMAGE;
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(price) || 0);
}

export function slugToPath(slug) {
  return slug === 'home' ? '/' : `/${slug}`;
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event('freshcart-auth-changed'));
}
