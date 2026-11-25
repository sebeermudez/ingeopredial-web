import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';
import type { Contratista, VistaFinancieraProps } from '../../types/contratistas';
import { ApiError, apiFetch, flagActivo, formatoCOP } from './api';
import './finanzas.css';

type FormContratista = {
  nombre_completo: string;
  tipo_documento: string;
  documento_nit: string;
  telefono: string;
  correo: string;
  especialidad: string;
  matricula_profesional: string;
  registro_raa: string;
  ciudad_base: string;
  departamento_cobertura: string;
  tipo_persona: string;
  declarante_renta: boolean;
  regimen_simple: boolean;
  aplica_art_383: boolean;
  responsable_iva: boolean;
  banco: string;
  tipo_cuenta: string;
  numero_cuenta: string;
  tarifa_referencia_cop: string;
  unidad_tarifa: string;
  estado_registro: string;
  calificacion_interna: string;
  notas: string;
};

const FORM_VACIO: FormContratista = {
  nombre_completo: '',
  tipo_documento: 'CC',
  documento_nit: '',
  telefono: '',
  correo: '',
  especialidad: '',
  matricula_profesional: '',
  registro_raa: '',
  ciudad_base: 'Bogotá D.C.',
  departamento_cobertura: 'Cundinamarca',
  tipo_persona: 'NATURAL',
  declarante_renta: false,
  regimen_simple: false,
  aplica_art_383: false,
  responsable_iva: false,
  banco: '',
  tipo_cuenta: 'AHORROS',
  numero_cuenta: '',
  tarifa_referencia_cop: '',
  unidad_tarifa: '',
  estado_registro: 'ACTIVO',
  calificacion_interna: '',
  notas: '',
};

const ESPECIALIDADES_SUGERIDAS = [
  'Avaluador RAA',
  'Topógrafo',
  'Ingeniero Catastral',
  'Abogado Inmobiliario',
  'Arquitecto',
  'Dibujante CAD/GIS',
  'Auxiliar de Campo',
];

const ESTADOS_REGISTRO = ['ACTIVO', 'PENDIENTE', 'INACTIVO'];

function aForm(c: Contratista): FormContratista {
  const s = (v: unknown) => (v === null || v === undefined ? '' : String(v));
  return {
    nombre_completo: s(c.nombre_completo),
    tipo_documento: s(c.tipo_documento) || 'CC',
    documento_nit: s(c.documento_nit),
    telefono: s(c.telefono),
    correo: s(c.correo),
    especialidad: s(c.especialidad),
    matricula_profesional: s(c.matricula_profesional),
    registro_raa: s(c.registro_raa),
    ciudad_base: s(c.ciudad_base),
    departamento_cobertura: s(c.departamento_cobertura),
    tipo_persona: s(c.tipo_persona) || 'NATURAL',
    declarante_renta: flagActivo(c.declarante_renta),
    regimen_simple: flagActivo(c.regimen_simple),
    aplica_art_383: flagActivo(c.aplica_art_383),
    responsable_iva: flagActivo(c.responsable_iva),
    banco: s(c.banco),
    tipo_cuenta: s(c.tipo_cuenta) || 'AHORROS',
    numero_cuenta: s(c.numero_cuenta),
    tarifa_referencia_cop: s(c.tarifa_referencia_cop),
    unidad_tarifa: s(c.unidad_tarifa),
    estado_registro: s(c.estado_registro),
    calificacion_interna: s(c.calificacion_interna),
    notas: s(c.notas),
  };
}

function aPayload(f: FormContratista): Record<string, unknown> {
  return {
    ...f,
    declarante_renta: f.declarante_renta ? 1 : 0,
    regimen_simple: f.regimen_simple ? 1 : 0,
    aplica_art_383: f.aplica_art_383 ? 1 : 0,
    responsable_iva: f.responsable_iva ? 1 : 0,
    tarifa_referencia_cop: f.tarifa_referencia_cop === '' ? null : Number(f.tarifa_referencia_cop),
    calificacion_interna: f.calificacion_interna === '' ? null : Number(f.calificacion_interna),
  };
}

function badgeEstado(estado: string | null | undefined): string {
  const e = (estado || '').toUpperCase();
  if (['ACTIVO', 'APROBADO', 'VERIFICADO', 'COMPLETO'].includes(e)) return 'verde';
  if (['PENDIENTE', 'EN_REVISION', 'INCOMPLETO'].includes(e)) return 'ambar';
  if (['INACTIVO', 'RECHAZADO', 'BLOQUEADO'].includes(e)) return 'rojo';
  return '';
}

export function ContratistasView({ token, apiUrl, onSesionExpirada }: Omit<VistaFinancieraProps, 'proyectos'>) {
  const [contratistas, setContratistas] = useState<Contratista[]>([]);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState<FormContratista>(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');

  const manejarError = useCallback(
    (err: unknown, setter: (m: string) => void) => {
      if (err instanceof ApiError && err.status === 401) {
        onSesionExpirada();
        return;
      }
      setter(err instanceof Error ? err.message : 'Error de conexión con la API.');
    },
    [onSesionExpirada]
  );

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filtroEspecialidad) params.set('especialidad', filtroEspecialidad);
      const data = await apiFetch<{ contratistas: Contratista[]; especialidades: string[] }>(
        apiUrl,
        token,
        `/api/contratistas${params.toString() ? `?${params}` : ''}`
      );
      setContratistas(data.contratistas || []);
      if (!filtroEspecialidad) setEspecialidades(data.especialidades || []);
    } catch (err) {
      manejarError(err, setError);
    } finally {
      setCargando(false);
    }
  }, [apiUrl, token, filtroEspecialidad, manejarError]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return contratistas;
    return contratistas.filter((c) =>
      [c.nombre_completo, c.documento_nit, c.correo, c.ciudad_base, c.especialidad, c.registro_raa]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [contratistas, busqueda]);

  const abrirNuevo = () => {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setErrorModal('');
    setModalAbierto(true);
  };

  const abrirEditar = (c: Contratista) => {
    setEditandoId(c.id);
    setForm(aForm(c));
    setErrorModal('');
    setModalAbierto(true);
  };

  const set = <K extends keyof FormContratista>(k: K, v: FormContratista[K]) => setForm((f) => ({ ...f, [k]: v }));

  const guardar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGuardando(true);
    setErrorModal('');
    try {
      const data = await apiFetch<{ mensaje: string }>(
        apiUrl,
        token,
        editandoId ? `/api/contratistas/${editandoId}` : '/api/contratistas',
        { method: editandoId ? 'PUT' : 'POST', body: aPayload(form) }
      );
      setMensaje(data.mensaje);
      setModalAbierto(false);
      cargar();
    } catch (err) {
      manejarError(err, setErrorModal);
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (c: Contratista) => {
    if (!window.confirm(`¿Eliminar al contratista ${c.nombre_completo}? Esta acción no se puede deshacer.`)) return;
    setError('');
    setMensaje('');
    try {
      const data = await apiFetch<{ mensaje: string }>(apiUrl, token, `/api/contratistas/${c.id}`, { method: 'DELETE' });
      setMensaje(data.mensaje);
      cargar();
    } catch (err) {
      manejarError(err, setError);
    }
  };

  const opcionesEspecialidad = Array.from(new Set([...especialidades, ...ESPECIALIDADES_SUGERIDAS]));
  const opcionesEstado =
    form.estado_registro && !ESTADOS_REGISTRO.includes(form.estado_registro)
      ? [...ESTADOS_REGISTRO, form.estado_registro]
      : ESTADOS_REGISTRO;
  const activos = contratistas.filter((c) => badgeEstado(c.estado_registro) === 'verde').length;
  const saldoTotal = contratistas.reduce((a, c) => a + Number(c.saldo_pendiente_cop || 0), 0);

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Contratistas Registrados</span>
          <strong>{contratistas.length}</strong>
        </div>
        <div className="kpi-card green">
          <span>Activos / Verificados</span>
          <strong>{activos}</strong>
        </div>
        <div className="kpi-card">
          <span>Saldo Neto Pendiente por Pagar</span>
          <strong>{formatoCOP(saldoTotal)}</strong>
        </div>
      </div>

      <div className="card">
        <div className="fin-card-header">
          <h3>
            <Users size={20} /> Directorio de Contratistas Aliados
          </h3>
          <button type="button" className="btn btn-primary" onClick={abrirNuevo}>
            <Plus size={18} /> Nuevo Contratista
          </button>
        </div>

        <div className="fin-toolbar">
          <div className="form-group">
            <label>Buscar</label>
            <input
              placeholder="Nombre, documento, correo, ciudad, RAA…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Especialidad</label>
            <select value={filtroEspecialidad} onChange={(e) => setFiltroEspecialidad(e.target.value)}>
              <option value="">Todas las especialidades</option>
              {especialidades.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn-secondary" onClick={cargar} disabled={cargando}>
            <Search size={16} /> {cargando ? 'Cargando…' : 'Actualizar'}
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {mensaje && <div className="fin-alert-ok">{mensaje}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Contratista</th>
                <th>Especialidad</th>
                <th>Cobertura</th>
                <th>Perfil Tributario</th>
                <th>Cuenta Bancaria</th>
                <th>Estado</th>
                <th className="fin-num">Saldo Pendiente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="fin-empty">
                    {cargando ? 'Cargando contratistas…' : 'No hay contratistas que coincidan con el filtro.'}
                  </td>
                </tr>
              ) : (
                filtrados.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.nombre_completo}</strong>
                      <div className="fin-muted">
                        {c.tipo_documento || 'Doc'} {c.documento_nit} • {c.telefono}
                      </div>
                      <div className="fin-muted">{c.correo}</div>
                    </td>
                    <td>
                      {c.especialidad}
                      {(c.registro_raa || c.matricula_profesional) && (
                        <div className="fin-muted">
                          {c.registro_raa ? `RAA ${c.registro_raa}` : `MP ${c.matricula_profesional}`}
                        </div>
                      )}
                    </td>
                    <td>
                      {c.ciudad_base}
                      <div className="fin-muted">{c.departamento_cobertura}</div>
                    </td>
                    <td>
                      <div className="fin-badges">
                        <span className="fin-badge azul">{c.tipo_persona || 'NATURAL'}</span>
                        {flagActivo(c.declarante_renta) && <span className="fin-badge">Declarante</span>}
                        {flagActivo(c.regimen_simple) && <span className="fin-badge">R. Simple</span>}
                        {flagActivo(c.aplica_art_383) && <span className="fin-badge">Art. 383</span>}
                        {flagActivo(c.responsable_iva) && <span className="fin-badge">IVA</span>}
                      </div>
                    </td>
                    <td>
                      {c.banco ? (
                        <>
                          {c.banco}
                          <div className="fin-muted">
                            {c.tipo_cuenta} {c.numero_cuenta}
                          </div>
                        </>
                      ) : (
                        <span className="fin-badge ambar">Sin cuenta</span>
                      )}
                    </td>
                    <td>
                      <span className={`fin-badge ${badgeEstado(c.estado_registro)}`}>{c.estado_registro || 'SIN ESTADO'}</span>
                    </td>
                    <td className="fin-num">{formatoCOP(c.saldo_pendiente_cop)}</td>
                    <td>
                      <div className="fin-actions">
                        <button type="button" className="btn btn-light btn-sm" onClick={() => abrirEditar(c)}>
                          <Pencil size={14} /> Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminar(c)}
                          disabled={Number(c.total_cxp || 0) > 0}
                          title={Number(c.total_cxp || 0) > 0 ? 'Tiene cuentas por pagar asociadas' : 'Eliminar'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAbierto && (
        <div className="fin-modal-backdrop" onClick={() => !guardando && setModalAbierto(false)}>
          <form className="fin-modal" onClick={(e) => e.stopPropagation()} onSubmit={guardar}>
            <div className="fin-modal-header">
              <h3>{editandoId ? 'Editar Contratista' : 'Registrar Nuevo Contratista'}</h3>
              <button type="button" className="fin-modal-close" onClick={() => setModalAbierto(false)} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <div className="fin-modal-body">
              {errorModal && <div className="alert-error">{errorModal}</div>}

              <div className="fin-section-title">Datos personales</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre completo / Razón social *</label>
                  <input required value={form.nombre_completo} onChange={(e) => set('nombre_completo', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Tipo de documento</label>
                  <select value={form.tipo_documento} onChange={(e) => set('tipo_documento', e.target.value)}>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="NIT">NIT</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Documento / NIT *</label>
                  <input required value={form.documento_nit} onChange={(e) => set('documento_nit', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Teléfono *</label>
                  <input required value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Correo *</label>
                  <input type="email" required value={form.correo} onChange={(e) => set('correo', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Ciudad base *</label>
                  <input required value={form.ciudad_base} onChange={(e) => set('ciudad_base', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Departamento(s) de cobertura *</label>
                  <input
                    required
                    value={form.departamento_cobertura}
                    onChange={(e) => set('departamento_cobertura', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Estado de registro</label>
                  <select value={form.estado_registro} onChange={(e) => set('estado_registro', e.target.value)}>
                    <option value="">— Sin estado —</option>
                    {opcionesEstado.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="fin-section-title">Perfil profesional (RAA / Matrícula)</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Especialidad *</label>
                  <input
                    required
                    list="fin-especialidades"
                    value={form.especialidad}
                    onChange={(e) => set('especialidad', e.target.value)}
                  />
                  <datalist id="fin-especialidades">
                    {opcionesEspecialidad.map((esp) => (
                      <option key={esp} value={esp} />
                    ))}
                  </datalist>
                </div>
                <div className="form-group">
                  <label>Registro RAA</label>
                  <input value={form.registro_raa} onChange={(e) => set('registro_raa', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Matrícula profesional</label>
                  <input value={form.matricula_profesional} onChange={(e) => set('matricula_profesional', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Tarifa de referencia (COP)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.tarifa_referencia_cop}
                    onChange={(e) => set('tarifa_referencia_cop', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Unidad de tarifa</label>
                  <input
                    placeholder="Por avalúo, por día, por hectárea…"
                    value={form.unidad_tarifa}
                    onChange={(e) => set('unidad_tarifa', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Calificación interna (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step={0.5}
                    value={form.calificacion_interna}
                    onChange={(e) => set('calificacion_interna', e.target.value)}
                  />
                </div>
              </div>

              <div className="fin-section-title">Perfil tributario</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tipo de persona</label>
                  <select value={form.tipo_persona} onChange={(e) => set('tipo_persona', e.target.value)}>
                    <option value="NATURAL">Persona Natural</option>
                    <option value="JURIDICA">Persona Jurídica</option>
                  </select>
                </div>
              </div>
              <div className="fin-check-grid">
                <label className="fin-check">
                  <input
                    type="checkbox"
                    checked={form.declarante_renta}
                    onChange={(e) => set('declarante_renta', e.target.checked)}
                  />
                  Declarante de renta
                </label>
                <label className="fin-check">
                  <input type="checkbox" checked={form.regimen_simple} onChange={(e) => set('regimen_simple', e.target.checked)} />
                  Régimen Simple (RST)
                </label>
                <label className="fin-check">
                  <input type="checkbox" checked={form.aplica_art_383} onChange={(e) => set('aplica_art_383', e.target.checked)} />
                  Aplica Art. 383 E.T.
                </label>
                <label className="fin-check">
                  <input
                    type="checkbox"
                    checked={form.responsable_iva}
                    onChange={(e) => set('responsable_iva', e.target.checked)}
                  />
                  Responsable de IVA
                </label>
              </div>

              <div className="fin-section-title">Cuenta bancaria para pagos</div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Banco</label>
                  <input value={form.banco} onChange={(e) => set('banco', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Tipo de cuenta</label>
                  <select value={form.tipo_cuenta} onChange={(e) => set('tipo_cuenta', e.target.value)}>
                    <option value="AHORROS">Ahorros</option>
                    <option value="CORRIENTE">Corriente</option>
                    <option value="DEPOSITO_ELECTRONICO">Depósito electrónico (Nequi/Daviplata)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Número de cuenta</label>
                  <input value={form.numero_cuenta} onChange={(e) => set('numero_cuenta', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Notas internas</label>
                <textarea rows={3} value={form.notas} onChange={(e) => set('notas', e.target.value)} />
              </div>
            </div>

            <div className="fin-modal-footer">
              <button type="button" className="btn btn-light" onClick={() => setModalAbierto(false)} disabled={guardando}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? 'Guardando…' : editandoId ? 'Guardar Cambios' : 'Registrar Contratista'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ContratistasView;
