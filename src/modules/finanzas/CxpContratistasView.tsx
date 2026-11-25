import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Receipt, RefreshCw } from 'lucide-react';
import type { Contratista, CxpContratista, ResumenCxp, VistaFinancieraProps } from '../../types/contratistas';
import { ApiError, apiFetch, fechaCorta, flagActivo, formatoCOP, formatoPct, previsualizarNeto } from './api';
import './finanzas.css';

const SOPORTES: Array<{ key: 'tiene_rut' | 'tiene_cuenta_cobro' | 'tiene_pila'; label: string }> = [
  { key: 'tiene_rut', label: 'RUT' },
  { key: 'tiene_cuenta_cobro', label: 'Cuenta de Cobro' },
  { key: 'tiene_pila', label: 'PILA' },
];

const FORM_INICIAL = {
  proyecto_id: '',
  contratista_id: '',
  concepto: '',
  valor_bruto: '',
  porcentaje_retefuente: '',
  porcentaje_reteica: '',
  fecha_causacion: '',
  tiene_rut: false,
  tiene_cuenta_cobro: false,
  tiene_pila: false,
};

/** Sugerencia de retefuente por honorarios (editable): 11% declarante/jurídica, 10% no declarante. */
function sugerirRetefuente(c: Contratista | undefined): string {
  if (!c) return '';
  if ((c.tipo_persona || '').toUpperCase() === 'JURIDICA' || flagActivo(c.declarante_renta)) return '11';
  return '10';
}

export function CxpContratistasView({ token, apiUrl, proyectos, onSesionExpirada }: VistaFinancieraProps) {
  const [cxp, setCxp] = useState<CxpContratista[]>([]);
  const [resumen, setResumen] = useState<ResumenCxp>({ bruto: 0, retenciones: 0, neto: 0, pendiente: 0, pagado: 0 });
  const [contratistas, setContratistas] = useState<Contratista[]>([]);
  const [filtroProyecto, setFiltroProyecto] = useState('');
  const [filtroContratista, setFiltroContratista] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [form, setForm] = useState(FORM_INICIAL);
  const [rfEditado, setRfEditado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        onSesionExpirada();
        return;
      }
      setError(err instanceof Error ? err.message : 'Error de conexión con la API.');
    },
    [onSesionExpirada]
  );

  const cargarCxp = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filtroProyecto) params.set('proyecto_id', filtroProyecto);
      if (filtroContratista) params.set('contratista_id', filtroContratista);
      if (filtroEstado) params.set('estado', filtroEstado);
      const data = await apiFetch<{ cxp: CxpContratista[]; resumen: ResumenCxp }>(
        apiUrl,
        token,
        `/api/cxp-contratistas${params.toString() ? `?${params}` : ''}`
      );
      setCxp(data.cxp || []);
      setResumen(data.resumen);
    } catch (err) {
      manejarError(err);
    } finally {
      setCargando(false);
    }
  }, [apiUrl, token, filtroProyecto, filtroContratista, filtroEstado, manejarError]);

  useEffect(() => {
    cargarCxp();
  }, [cargarCxp]);

  useEffect(() => {
    apiFetch<{ contratistas: Contratista[] }>(apiUrl, token, '/api/contratistas')
      .then((d) => setContratistas(d.contratistas || []))
      .catch(manejarError);
  }, [apiUrl, token, manejarError]);

  const contratistaSel = contratistas.find((c) => String(c.id) === form.contratista_id);
  const preview = useMemo(
    () =>
      previsualizarNeto(Number(form.valor_bruto) || 0, Number(form.porcentaje_retefuente) || 0, Number(form.porcentaje_reteica) || 0),
    [form.valor_bruto, form.porcentaje_retefuente, form.porcentaje_reteica]
  );

  const etiquetaProyecto = (p: { consecutivo_contrato?: string | null; consecutivo_cotizacion?: string | null; cliente?: string | null }) =>
    `${p.consecutivo_contrato || p.consecutivo_cotizacion || ''}${p.cliente ? ` — ${p.cliente}` : ''}`;

  const seleccionarContratista = (id: string) => {
    const c = contratistas.find((x) => String(x.id) === id);
    setForm((f) => ({
      ...f,
      contratista_id: id,
      porcentaje_retefuente: rfEditado ? f.porcentaje_retefuente : sugerirRetefuente(c),
      tiene_rut: f.tiene_rut || Boolean(c?.ruta_rut),
    }));
  };

  const crearCxp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    setMensaje('');
    try {
      const data = await apiFetch<{ mensaje: string; cxp: CxpContratista }>(apiUrl, token, '/api/cxp-contratistas', {
        method: 'POST',
        body: {
          proyecto_id: Number(form.proyecto_id),
          contratista_id: Number(form.contratista_id),
          concepto: form.concepto,
          valor_bruto: Number(form.valor_bruto),
          porcentaje_retefuente: Number(form.porcentaje_retefuente) || 0,
          porcentaje_reteica: Number(form.porcentaje_reteica) || 0,
          fecha_causacion: form.fecha_causacion || null,
          tiene_rut: form.tiene_rut,
          tiene_cuenta_cobro: form.tiene_cuenta_cobro,
          tiene_pila: form.tiene_pila,
        },
      });
      setMensaje(`${data.mensaje} Neto a pagar: ${formatoCOP(data.cxp?.valor_neto_pagar)}`);
      setForm({ ...FORM_INICIAL, proyecto_id: form.proyecto_id });
      setRfEditado(false);
      cargarCxp();
    } catch (err) {
      manejarError(err);
    } finally {
      setGuardando(false);
    }
  };

  const toggleSoporte = async (item: CxpContratista, key: (typeof SOPORTES)[number]['key']) => {
    setError('');
    try {
      await apiFetch(apiUrl, token, `/api/cxp-contratistas/${item.id}`, {
        method: 'PATCH',
        body: { [key]: !Number(item[key] || 0) },
      });
      setCxp((lista) => lista.map((x) => (x.id === item.id ? { ...x, [key]: Number(item[key] || 0) ? 0 : 1 } : x)));
    } catch (err) {
      manejarError(err);
    }
  };

  const marcarPagado = async (item: CxpContratista) => {
    const faltantes = SOPORTES.filter((s) => !Number(item[s.key] || 0)).map((s) => s.label);
    const aviso = faltantes.length ? `\n\n⚠ Soportes faltantes: ${faltantes.join(', ')}.` : '';
    if (
      !window.confirm(
        `¿Marcar como PAGADA la CxP de ${item.contratista_nombre} por ${formatoCOP(item.valor_neto_pagar)} (neto)?${aviso}`
      )
    )
      return;
    setError('');
    setMensaje('');
    try {
      const data = await apiFetch<{ mensaje: string }>(apiUrl, token, `/api/cxp-contratistas/${item.id}`, {
        method: 'PATCH',
        body: { estado: 'PAGADO' },
      });
      setMensaje(data.mensaje);
      cargarCxp();
    } catch (err) {
      manejarError(err);
    }
  };

  const formValido = form.proyecto_id && form.contratista_id && form.concepto.trim() && Number(form.valor_bruto) > 0;

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Total Bruto Causado</span>
          <strong>{formatoCOP(resumen.bruto)}</strong>
        </div>
        <div className="kpi-card">
          <span>Retenciones (ReteFuente + ReteICA)</span>
          <strong>{formatoCOP(resumen.retenciones)}</strong>
        </div>
        <div className="kpi-card">
          <span>Neto Pendiente por Pagar</span>
          <strong style={{ color: '#92400e' }}>{formatoCOP(resumen.pendiente)}</strong>
        </div>
        <div className="kpi-card green">
          <span>Neto Pagado</span>
          <strong>{formatoCOP(resumen.pagado)}</strong>
        </div>
      </div>

      <div className="card">
        <h3>
          <Receipt size={20} /> Causar Cuenta por Pagar a Contratista
        </h3>
        <form onSubmit={crearCxp}>
          <div className="form-grid">
            <div className="form-group">
              <label>Expediente / Proyecto *</label>
              <select required value={form.proyecto_id} onChange={(e) => setForm({ ...form, proyecto_id: e.target.value })}>
                <option value="">Seleccione un expediente…</option>
                {proyectos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {etiquetaProyecto(p)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Contratista *</label>
              <select required value={form.contratista_id} onChange={(e) => seleccionarContratista(e.target.value)}>
                <option value="">Seleccione un contratista…</option>
                {contratistas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre_completo} — {c.especialidad}
                  </option>
                ))}
              </select>
              {contratistaSel && (
                <span className="fin-muted">
                  {contratistaSel.tipo_persona || 'NATURAL'}
                  {flagActivo(contratistaSel.declarante_renta) ? ' • Declarante' : ' • No declarante'}
                  {flagActivo(contratistaSel.aplica_art_383) ? ' • Aplica Art. 383 (verificar tabla)' : ''}
                  {contratistaSel.banco
                    ? ` • ${contratistaSel.banco} ${contratistaSel.tipo_cuenta || ''} ${contratistaSel.numero_cuenta || ''}`
                    : ' • Sin cuenta bancaria registrada'}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Concepto *</label>
              <input
                required
                placeholder="Ej: Honorarios avalúo comercial Fase 1"
                value={form.concepto}
                onChange={(e) => setForm({ ...form, concepto: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Valor bruto (COP) *</label>
              <input
                type="number"
                required
                min={1}
                value={form.valor_bruto}
                onChange={(e) => setForm({ ...form, valor_bruto: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>% ReteFuente</label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={form.porcentaje_retefuente}
                onChange={(e) => {
                  setRfEditado(true);
                  setForm({ ...form, porcentaje_retefuente: e.target.value });
                }}
              />
            </div>
            <div className="form-group">
              <label>% ReteICA</label>
              <input
                type="number"
                min={0}
                max={100}
                step="0.001"
                placeholder="Ej: 0.966 (Bogotá)"
                value={form.porcentaje_reteica}
                onChange={(e) => setForm({ ...form, porcentaje_reteica: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Fecha de causación</label>
              <input
                type="date"
                value={form.fecha_causacion}
                onChange={(e) => setForm({ ...form, fecha_causacion: e.target.value })}
              />
            </div>
          </div>

          <div className="fin-preview">
            <div className="fin-preview-row">
              <span>Valor bruto</span>
              <span>{formatoCOP(preview.bruto)}</span>
            </div>
            <div className="fin-preview-row">
              <span>(−) ReteFuente {formatoPct(Number(form.porcentaje_retefuente))}</span>
              <span>{formatoCOP(preview.retefuente)}</span>
            </div>
            <div className="fin-preview-row">
              <span>(−) ReteICA {formatoPct(Number(form.porcentaje_reteica))}</span>
              <span>{formatoCOP(preview.reteica)}</span>
            </div>
            <div className="fin-preview-row total">
              <span>Neto a pagar (vista previa)</span>
              <span>{formatoCOP(preview.neto)}</span>
            </div>
          </div>

          <div className="fin-check-grid">
            {SOPORTES.map((s) => (
              <label key={s.key} className="fin-check">
                <input type="checkbox" checked={form[s.key]} onChange={(e) => setForm({ ...form, [s.key]: e.target.checked })} />
                {s.label} recibido
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-primary" disabled={guardando || !formValido}>
            <Receipt size={18} /> {guardando ? 'Causando…' : 'Causar Cuenta por Pagar'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="fin-card-header">
          <h3>Cuentas por Pagar a Contratistas</h3>
          <button type="button" className="btn btn-secondary btn-sm" onClick={cargarCxp} disabled={cargando}>
            <RefreshCw size={14} /> {cargando ? 'Cargando…' : 'Actualizar'}
          </button>
        </div>

        <div className="fin-toolbar">
          <div className="form-group">
            <label>Expediente</label>
            <select value={filtroProyecto} onChange={(e) => setFiltroProyecto(e.target.value)}>
              <option value="">Todos los expedientes</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>
                  {etiquetaProyecto(p)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Contratista</label>
            <select value={filtroContratista} onChange={(e) => setFiltroContratista(e.target.value)}>
              <option value="">Todos los contratistas</option>
              {contratistas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre_completo}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="">Todos</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="PAGADO">PAGADO</option>
            </select>
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {mensaje && <div className="fin-alert-ok">{mensaje}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Contratista</th>
                <th>Expediente</th>
                <th>Concepto</th>
                <th className="fin-num">Bruto</th>
                <th className="fin-num">Retenciones</th>
                <th className="fin-num">Neto a Pagar</th>
                <th>Soportes</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {cxp.length === 0 ? (
                <tr>
                  <td colSpan={9} className="fin-empty">
                    {cargando ? 'Cargando cuentas por pagar…' : 'No hay cuentas por pagar registradas para este filtro.'}
                  </td>
                </tr>
              ) : (
                cxp.map((x) => {
                  const pagada = (x.estado || '').toUpperCase() === 'PAGADO';
                  return (
                    <tr key={x.id}>
                      <td>
                        <strong>{x.contratista_nombre || `#${x.contratista_id}`}</strong>
                        <div className="fin-muted">{x.contratista_especialidad}</div>
                      </td>
                      <td>
                        {x.consecutivo_contrato || x.consecutivo_cotizacion || `#${x.proyecto_id}`}
                        <div className="fin-muted">{x.cliente}</div>
                      </td>
                      <td>
                        {x.concepto}
                        <div className="fin-muted">Causada: {fechaCorta(x.fecha_causacion)}</div>
                      </td>
                      <td className="fin-num">{formatoCOP(x.valor_bruto)}</td>
                      <td className="fin-num">
                        {formatoCOP(Number(x.valor_retefuente || 0) + Number(x.valor_reteica || 0))}
                        <div className="fin-muted">
                          RF {formatoPct(x.porcentaje_retefuente)} • ICA {formatoPct(x.porcentaje_reteica)}
                        </div>
                      </td>
                      <td className="fin-num">
                        <strong>{formatoCOP(x.valor_neto_pagar)}</strong>
                      </td>
                      <td>
                        <div className="fin-soportes">
                          {SOPORTES.map((s) => (
                            <label key={s.key}>
                              <input
                                type="checkbox"
                                checked={Boolean(Number(x[s.key] || 0))}
                                onChange={() => toggleSoporte(x, s.key)}
                              />
                              {s.label === 'Cuenta de Cobro' ? 'CC' : s.label}
                            </label>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`fin-badge ${pagada ? 'verde' : 'ambar'}`}>{pagada ? 'PAGADO' : x.estado || 'PENDIENTE'}</span>
                        {pagada && <div className="fin-muted">{fechaCorta(x.fecha_pago)}</div>}
                      </td>
                      <td>
                        {!pagada ? (
                          <button type="button" className="btn btn-primary btn-sm" onClick={() => marcarPagado(x)}>
                            <CheckCircle2 size={14} /> Marcar PAGADO
                          </button>
                        ) : (
                          <span className="fin-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default CxpContratistasView;
