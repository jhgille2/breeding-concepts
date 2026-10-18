// Shared helpers for concept widgets.

// Categorical colors in fixed order (validated light-mode palette).
// Assign by entity, never by rank, so a series keeps its color across pages.
export const pal = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"];
export const muted = "#b8b8b8";

// Standard normal density and inverse CDF (Acklam's approximation, |error| < 1.2e-9).
export function dnorm(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export function qnorm(p) {
  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const lo = 0.02425, hi = 1 - lo;
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p < lo) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= hi) {
    const q = p - 0.5, r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

// Selection intensity for truncation selection of the top fraction p of an infinite normal population.
export function intensity(p) {
  return dnorm(qnorm(1 - p)) / p;
}

// Seeded uniform RNG (mulberry32) so a widget redraws the same sample until reseeded.
export function rng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Standard normal deviates from a uniform RNG (Box–Muller).
export function normal(u) {
  return function () {
    const r = Math.sqrt(-2 * Math.log(1 - u()));
    return r * Math.cos(2 * Math.PI * u());
  };
}

// Binomial(n, p) draw from a uniform RNG; exact for n <= 1000, normal approximation above.
export function binomial(u, n, p) {
  if (p <= 0) return 0;
  if (p >= 1) return n;
  if (n <= 1000) {
    let k = 0;
    for (let i = 0; i < n; i++) if (u() < p) k++;
    return k;
  }
  const z = normal(u)();
  return Math.min(n, Math.max(0, Math.round(n * p + z * Math.sqrt(n * p * (1 - p)))));
}
