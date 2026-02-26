/**
 * Formatters - Funções de formatação reutilizáveis
 * 
 * Formatadores puros sem dependências de framework.
 * Podem ser usados em qualquer contexto (Vue, Node.js, etc).
 * 
 * @layer Utils
 */

/**
 * Formata número para moeda brasileira (BRL)
 * @example formatCurrency(1234.56) // "R$ 1.234,56"
 */
export function formatCurrency(
  value: number,
  locale: string = 'pt-BR',
  currency: string = 'BRL'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Formata número com separadores de milhar
 * @example formatNumber(1234567) // "1.234.567"
 */
export function formatNumber(
  value: number,
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formata número como porcentagem
 * @example formatPercent(0.1234) // "12,34%"
 */
export function formatPercent(
  value: number,
  decimals: number = 2,
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formata data para formato brasileiro
 * @example formatDate(new Date()) // "24/12/2024"
 */
export function formatDate(
  date: Date | string,
  locale: string = 'pt-BR'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Formata data e hora
 * @example formatDateTime(new Date()) // "24/12/2024 14:30"
 */
export function formatDateTime(
  date: Date | string,
  locale: string = 'pt-BR'
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
 * Formata data relativa (há X minutos, ontem, etc)
 * @example formatRelativeTime(new Date(Date.now() - 60000)) // "há 1 minuto"
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'pt-BR'
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
 * Formata CPF brasileiro
 * @example formatCPF("12345678901") // "123.456.789-01"
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ brasileiro
 * @example formatCNPJ("12345678000190") // "12.345.678/0001-90"
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj;
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata telefone brasileiro
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
 * Formata CEP brasileiro
 * @example formatCEP("12345678") // "12345-678"
 */
export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length !== 8) return cep;
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Trunca texto com ellipsis
 * @example truncate("Texto muito longo", 10) // "Texto mu..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitaliza primeira letra de cada palavra
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
 * Formata bytes para tamanho legível
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
 * Formata duração em segundos para formato legível
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
 * Slug - converte texto para URL amigável
 * @example slugify("Olá Mundo!") // "ola-mundo"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui não-alfanuméricos por hífen
    .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim
}