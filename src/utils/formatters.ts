/**
 * Formatters - reusable formatting helpers.
 * 
 * Pure formatters with no framework dependencies.
 * They can be used in any context (Vue, Node.js, etc).
 * 
 * @layer Utils
 */

/**
 * Formats a number as currency.
 * @example formatCurrency(1234.56) // "$1,234.56"
 */
export function formatCurrency(
  value: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Formats a number with thousands separators.
 * @example formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(
  value: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formats a number as a percentage.
 * @example formatPercent(0.1234) // "12.34%"
 */
export function formatPercent(
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a date.
 * @example formatDate(new Date()) // "12/24/2024"
 */
export function formatDate(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Formats a date and time.
 * @example formatDateTime(new Date()) // "12/24/2024, 2:30 PM"
 */
export function formatDateTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Formats relative time.
 * @example formatRelativeTime(new Date(Date.now() - 60000)) // "1 minute ago"
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSecs < 60) {
    return rtf.format(-diffSecs, 'second');
  } else if (diffMins < 60) {
    return rtf.format(-diffMins, 'minute');
  } else if (diffHours < 24) {
    return rtf.format(-diffHours, 'hour');
  } else if (diffDays < 30) {
    return rtf.format(-diffDays, 'day');
  } else {
    return formatDate(d, locale);
  }
}

/**
 * Formats Brazilian CPF.
 * @example formatCPF("12345678901") // "123.456.789-01"
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formats Brazilian CNPJ.
 * @example formatCNPJ("12345678000190") // "12.345.678/0001-90"
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj;
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formats Brazilian phone number.
 * @example formatPhone("11987654321") // "(11) 98765-4321"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

/**
 * Formats Brazilian postal code.
 * @example formatCEP("12345678") // "12345-678"
 */
export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length !== 8) return cep;
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Truncates text with an ellipsis.
 * @example truncate("Very long text", 10) // "Very lo..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalizes the first letter of each word.
 * @example capitalize("hello world") // "Hello World"
 */
export function capitalize(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats bytes as a readable size.
 * @example formatBytes(1024) // "1 KB"
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Formats a duration in seconds.
 * @example formatDuration(3661) // "1h 1m 1s"
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);

  return parts.join(' ');
}

/**
 * Slug - converts text to a URL-friendly slug.
 * @example slugify("Hello World!") // "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumerics with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
