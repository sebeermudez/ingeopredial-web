import { useCallback, useEffect, useState } from 'react';
import { Calculator, PieChart, RefreshCw } from 'lucide-react';
import type { DetalleLiquidacion, Liquidacion, VistaFinancieraProps } from '../../types/contratistas';
import { ApiError, apiFetch, fechaCorta, formatoCOP, formatoPct } from './api';
import './finanzas.css';

const CAMPOS_COMPARABLES: Array<keyof Liquidacion> = [
  'ingreso_bruto',
  'costos_directos_operativos',
  'honorarios_tecnicos_externos',
  'utilidad_distribuible_socios',
];

export function LiquidacionesView({ token, apiUrl, proyectos, onSesionExpirada }: VistaFinancieraProps) {
  const [proyectoId, setProyectoId] = useState('');
  const [detalle, setDetalle] = useState<DetalleLiquidacion | null>(null);
  const [historial, setHistorial] = useState<Liquidacion[]>([]);
  const [costosDirectos, setCostosDirectos] = useState('');
  const [cargando, setCargando] = useState(false);
  const [recalculando, setRecalculando] = useState(false);
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

  const cargarHistorial = useCallback(async () => {
    try {
      const data = await apiFetch<{ liquidaciones: Liquidacion[] }>(apiUrl, token, '/api/liquidaciones');
      setHistorial(data.liquidaciones || []);
    } catch (err) {
      manejarError(err);
    }
  }, [apiUrl, token, manejarError]);

  const cargarDetalle = useCallback(
    async (id: string) => {
      if (!id) {
        setDetalle(null);
        return;
      }
      setCargando(true);
      setError('');
      try {
        const data = await apiFetch<DetalleLiquidacion>(apiUrl, token, `/api/liquidaciones/${id}`);
        setDetalle(data);
        const costos = data.liquidacion?.costos_directos_operativos ?? data.calculo_actual.costos_directos_operativos;
        setCostosDirectos(costos !== null && costos !== undefined ? String(costos) : '');
      } catch (err) {
        manejarError(err);
        setDetalle(null);
      } finally {
        setCargando(false);
      }
    },
    [apiUrl, token, manejarError]
  );

  useEffect(() => {
    cargarHistorial();
  }, [cargarHistorial]);

  useEffect(() => {
    setMensaje('');
    cargarDetalle(proyectoId);
  }, [proyectoId, cargarDetalle]);

  const recalcular = async () => {
    if (!proyectoId) return;
    setRecalculando(true);
    setError('');
    setMensaje('');
    try {
      const data = await apiFetch<{ mensaje: string }>(apiUrl, token, `/api/liquidaciones/${proyectoId}`, {
        method: 'POST',
        body: { costos_directos_operativos: costosDirectos === '' ? null : Number(costosDirectos) },
      });
      setMensaje(data.mensaje);
      await Promise.all([cargarDetalle(proyectoId), cargarHistorial()]);
    } catch (err) {
      manejarError(err);
    } finally {
      setRecalculando(false);
    }
  };

  const guardada = detalle?.liquidacion ?? null;
  const vista: Liquidacion | null = guardada ?? detalle?.calculo_actual ?? null;
  const desactualizada =
    guardada && detalle
      ? CAMPOS_COMPARABLES.some((k) => Number(guardada[k] || 0) !== Number(detalle.calculo_actual[k] || 0))
      : false;

  return (
    <>
      <div className="card">
        <div className="fin-card-header">
          <h3>
            <PieChart size={20} /> Liquidación Financiera por Expediente
          </h3>
        </div>

        <div className="fin-toolbar">
          <div className="form-group">
            <label>Expediente / Proyecto</label>
            <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)}>
              <option value="">Seleccione un expediente…</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.consecutivo_contrato || p.consecutivo_cotizacion} — {p.cliente}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Costos directos operativos (COP)</label>
            <input
              type="number"
              min={0}
              placeholder="Viáticos, transporte, insumos…"
              value={costosDirectos}
              onChange={(e) => setCostosDirectos(e.target.value)}
              disabled={!proyectoId}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={recalcular} disabled={!proyectoId || recalculando}>
            <Calculator size={18} /> {recalculando ? 'Recalculando…' : 'Recalcular Liquidación'}
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {mensaje && <div className="fin-alert-ok">{mensaje}</div>}

        {!proyectoId && <p className="fin-muted">Seleccione un expediente para ver o calcular su liquidación.</p>}
        {proyectoId && cargando && <p className="fin-muted">Cargando liquidación…</p>}

        {detalle && vista && !cargando && (
          <>
            {!guardada && (
              <div className="alert-warning" style={{ marginTop: 0, marginBottom: '1rem' }}>
                Este expediente aún no tiene liquidación guardada. Se muestra una <strong>vista previa</strong>; presione
                “Recalcular Liquidación” para guardarla.
              </div>
            )}
            {desactualizada && (
              <div className="alert-warning" style={{ marginTop: 0, marginBottom: '1rem' }}>
                La liquidación guardada difiere del cálculo actual (nuevas CxP o cambios en el proyecto). Recalcule para
                actualizarla.
              </div>
            )}

            <div className="liq-grid">
              <div className="liq-waterfall">
                <div className="liq-row">
                  <div className="liq-label">
                    Ingreso Bruto
                    <small>{detalle.fuente_ingreso === 'VALOR_PROYECTO' ? 'Valor total del contrato' : 'Suma de hitos de pago'}</small>
                  </div>
                  <strong className="liq-valor">{formatoCOP(vista.ingreso_bruto)}</strong>
                </div>
                <div className="liq-row menos">
                  <div className="liq-label">
                    (−) Honorarios Técnicos Externos
                    <small>{detalle.cxp.total} CxP a contratistas (valor bruto)</small>
                  </div>
                  <span className="liq-valor">{formatoCOP(vista.honorarios_tecnicos_externos)}</span>
                </div>
                <div className="liq-row menos">
                  <div className="liq-label">(−) Costos Directos Operativos</div>
                  <span className="liq-valor">{formatoCOP(vista.costos_directos_operativos)}</span>
                </div>
                <div className="liq-row subtotal">
                  <div className="liq-label">= Utilidad Neta Base</div>
                  <span className="liq-valor">{formatoCOP(vista.utilidad_neta_base)}</span>
                </div>
                <div className="liq-row menos">
                  <div className="liq-label">
                    (−) Comisión Comercial
                    <small>{formatoPct(vista.porcentaje_comision_aplicado)} aplicado</small>
                  </div>
                  <span className="liq-valor">{formatoCOP(vista.comision_comercial_cop)}</span>
                </div>
                <div className="liq-row subtotal">
                  <div className="liq-label">= Utilidad Después de Comisión</div>
                  <span className="liq-valor">{formatoCOP(vista.utilidad_despues_comision)}</span>
                </div>
                <div className="liq-row menos">
                  <div className="liq-label">
                    (−) Reserva Operativa <small>15 %</small>
                  </div>
                  <span className="liq-valor">{formatoCOP(vista.reserva_operativa_cop)}</span>
                </div>
                <div className="liq-row menos">
                  <div className="liq-label">
                    (−) Aporte a Capitalización <small>25 %</small>
                  </div>
                  <span className="liq-valor">{formatoCOP(vista.aporte_capitalizacion_cop)}</span>
                </div>
                <div className="liq-row final">
                  <div className="liq-label">
                    Utilidad Distribuible a Socios
                    <small>
                      {guardada ? `Calculada ${fechaCorta(guardada.fecha_calculo)}` : 'Vista previa (sin guardar)'}
                    </small>
                  </div>
                  <span className="liq-valor">{formatoCOP(vista.utilidad_distribuible_socios)}</span>
                </div>
              </div>

              <div className="liq-side">
                <div className="kpi-card">
                  <span>Expediente</span>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {detalle.proyecto.consecutivo_contrato || detalle.proyecto.consecutivo_cotizacion}
                  </strong>
                  <span>
                    {detalle.proyecto.cliente} • {detalle.proyecto.estado}
                  </span>
                </div>
                <div className="kpi-card green">
                  <span>Hitos cobrados / pagados por el cliente</span>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {formatoCOP(detalle.hitos.cobrados_cop)} / {formatoCOP(detalle.hitos.pagados_cop)}
                  </strong>
                  <span>{detalle.hitos.pendientes} hito(s) pendientes de pago</span>
                </div>
                <div className="kpi-card">
                  <span>CxP contratistas (neto pendiente)</span>
                  <strong style={{ fontSize: '1.1rem' }}>{formatoCOP(detalle.cxp.pendiente_neto_cop)}</strong>
                  <span>
                    {detalle.cxp.pagadas}/{detalle.cxp.total} pagadas
                  </span>
                </div>
                <div className="kpi-card">
                  <span>Estado de liquidación</span>
                  <strong style={{ fontSize: '1.05rem' }}>
                    <span className={`fin-badge ${vista.estado_liquidacion === 'LIQUIDADO_TOTAL' ? 'verde' : 'ambar'}`}>
                      {guardada ? vista.estado_liquidacion : 'NO GUARDADA'}
                    </span>
                  </strong>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <div className="fin-card-header">
          <h3>Liquidaciones Guardadas</h3>
          <button type="button" className="btn btn-secondary btn-sm" onClick={cargarHistorial}>
            <RefreshCw size={14} /> Actualizar
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Expediente</th>
                <th>Cliente</th>
                <th className="fin-num">Ingreso Bruto</th>
                <th className="fin-num">Honorarios Ext.</th>
                <th className="fin-num">Utilidad Neta</th>
                <th className="fin-num">Distribuible Socios</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 ? (
                <tr>
                  <td colSpan={8} className="fin-empty">
                    Aún no hay liquidaciones guardadas.
                  </td>
                </tr>
              ) : (
                historial.map((l) => (
                  <tr
                    key={l.id ?? l.proyecto_id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setProyectoId(String(l.proyecto_id))}
                    title="Ver detalle"
                  >
                    <td>
                      <strong>{l.consecutivo_contrato || l.consecutivo_cotizacion || `#${l.proyecto_id}`}</strong>
                    </td>
                    <td>{l.cliente || '—'}</td>
                    <td className="fin-num">{formatoCOP(l.ingreso_bruto)}</td>
                    <td className="fin-num">{formatoCOP(l.honorarios_tecnicos_externos)}</td>
                    <td className="fin-num">{formatoCOP(l.utilidad_neta_base)}</td>
                    <td className="fin-num">
                      <strong>{formatoCOP(l.utilidad_distribuible_socios)}</strong>
                    </td>
                    <td>
                      <span className={`fin-badge ${l.estado_liquidacion === 'LIQUIDADO_TOTAL' ? 'verde' : 'ambar'}`}>
                        {l.estado_liquidacion || '—'}
                      </span>
                    </td>
                    <td>{fechaCorta(l.fecha_calculo)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default LiquidacionesView;
