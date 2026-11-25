import type { FlagSql } from '../../types/contratistas';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** fetch autenticado contra el backend Fastify. Lanza ApiError con el `detail` del servidor. */
export async function apiFetch<T>(
  apiUrl: string,
  token: string,
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`${apiUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const detail = (data as { detail?: string } | null)?.detail || `Error HTTP ${res.status}`;
    throw new ApiError(res.status, detail);
  }
  return data as T;
}

/** Formato pesos colombianos: $ 0.000.000 */
export const formatoCOP = (valor: number | null | undefined): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(valor) || 0);

export const formatoPct = (valor: number | null | undefined): string =>
  `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 3 }).format(Number(valor) || 0)} %`;

/** Interpreta flags 0/1, true/false o 'SI'/'NO' heredados. */
export function flagActivo(valor: FlagSql | undefined): boolean {
  if (typeof valor === 'string') return ['1', 'SI', 'SÍ', 'TRUE', 'S'].includes(valor.trim().toUpperCase());
  return Boolean(valor);
}

export function fechaCorta(valor: string | null | undefined): string {
  if (!valor) return '—';
  return valor.slice(0, 10);
}

/** Vista previa local (la cifra oficial siempre la calcula el backend). */
export function previsualizarNeto(bruto: number, pctRf: number, pctIca: number) {
  const b = Math.round(bruto || 0);
  const rf = Math.round(b * ((pctRf || 0) / 100));
  const ica = Math.round(b * ((pctIca || 0) / 100));
  return { bruto: b, retefuente: rf, reteica: ica, neto: b - rf - ica };
}
