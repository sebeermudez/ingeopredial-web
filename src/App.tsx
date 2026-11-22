import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Calendar,
  DollarSign,
  LayoutDashboard,
  LogOut,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Settings,
  UserPlus,
} from 'lucide-react';
import type {
  Usuario,
  UsuarioGestion,
  Proyecto,
  Visita,
  ResultadoVisita,
  TabActivo,
  RolUsuario,
} from './types/ingeopredial';

const API_URL: string = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('ing_token'));
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('ing_user');
    return saved ? (JSON.parse(saved) as Usuario) : null;
  });

  // Login state
  const [correo, setCorreo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  // Dashboard data
  const [tab, setTab] = useState<TabActivo>('dashboard');
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [mensajeGlobal, setMensajeGlobal] = useState<string>('');

  // Cotizador state
  const [modoCotizacion, setModoCotizacion] = useState<'formulario' | 'libre'>('formulario');
  const [instruccionLibre, setInstruccionLibre] = useState<string>('');
  const [cotForm, setCotForm] = useState({
    cliente_nombre: '',
    cliente_documento: '',
    cliente_telefono: '',
    cliente_correo: '',
    municipio: 'Bogotá D.C.',
    direccion_predio: '',
    tipo_servicio: 'Avalúo Comercial Urbano (Res. IGAC 941/2026)',
    area_terreno_m2: 0,
    area_construida_m2: 0,
    descripcion_alcance: '',
    valor_honorarios: 0,
  });
  const [resultadoCotizacion, setResultadoCotizacion] = useState<string>('');

  // Contratos state
  const [consecutivoManualContrato, setConsecutivoManualContrato] = useState<string>('');
  const [resultadoContrato, setResultadoContrato] = useState<string>('');

  // Visitas MWU-296 state
  const [visitaProyectoId, setVisitaProyectoId] = useState<number>(0);
  const [visitaFecha, setVisitaFecha] = useState<string>('');
  const [visitaHora, setVisitaHora] = useState<string>('08:00');
  const [alertaImpar, setAlertaImpar] = useState<string>('');
  const [resultadoVisita, setResultadoVisita] = useState<ResultadoVisita | null>(null);

  // Finanzas state
  const [cobroContrato, setCobroContrato] = useState<string>('');
  const [cobroFase, setCobroFase] = useState<number>(1);
  const [pagoContrato, setPagoContrato] = useState<string>('');
  const [pagoFase, setPagoFase] = useState<number>(1);
  const [pagoCostosReales, setPagoCostosReales] = useState<string>('');
  const [resultadoFinanzas, setResultadoFinanzas] = useState<string>('');

  // Ajustes / Gestión de Usuarios (SOCIO_ADMIN)
  const [usuariosLista, setUsuariosLista] = useState<UsuarioGestion[]>([]);
  const [nuevoUsuario, setNuevoUsuario] = useState<{
    nombre_completo: string;
    correo: string;
    password: string;
    rol: RolUsuario;
    especialidad: string;
    puede_cotizar: boolean;
    puede_aprobar: boolean;
  }>({
    nombre_completo: '',
    correo: '',
    password: '',
    rol: 'COLABORADOR_ALIADO',
    especialidad: '',
    puede_cotizar: true,
    puede_aprobar: false,
  });
  const [mensajeAjustes, setMensajeAjustes] = useState<string>('');

  const formatoCOP = (valor: number): string =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor || 0);

  const cargarDashboard = async (authToken: string): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        cerrarSesion();
        return;
      }
      const data = await res.json();
      setProyectos(data.proyectos || []);
      setVisitas(data.visitas || []);
      if (data.proyectos?.length > 0 && visitaProyectoId === 0) {
        setVisitaProyectoId(data.proyectos[0].id);
      }
    } catch {
      setMensajeGlobal('No se pudo conectar con el servidor FastAPI (puerto 8000).');
    }
  };

  const cargarUsuarios = async (authToken: string): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsuariosLista(data.usuarios || []);
      }
    } catch {
      setMensajeAjustes('Error al cargar el listado de usuarios.');
    }
  };

  useEffect(() => {
    if (token) {
      cargarDashboard(token);
      if (usuario?.rol === 'SOCIO_ADMIN') {
        cargarUsuarios(token);
      }
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoginError('');
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.detail || 'Credenciales inválidas.');
      } else {
        localStorage.setItem('ing_token', data.access_token);
        localStorage.setItem('ing_user', JSON.stringify(data.usuario));
        setToken(data.access_token);
        setUsuario(data.usuario);
      }
    } catch {
      setLoginError('Error de conexión con la API (verifique que uvicorn esté corriendo en el puerto 8000).');
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = (): void => {
    localStorage.removeItem('ing_token');
    localStorage.removeItem('ing_user');
    setToken(null);
    setUsuario(null);
  };

  const handleGenerarCotizacion = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!token) return;
    setCargando(true);
    setResultadoCotizacion('');
    try {
      const payload =
        modoCotizacion === 'libre'
          ? { instruccion_natural: instruccionLibre }
          : cotForm;

      const res = await fetch(`${API_URL}/api/cotizaciones/generar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setResultadoCotizacion(`Error: ${data.detail}`);
      } else {
        setResultadoCotizacion(
          typeof data.resultado === 'string'
            ? data.resultado
            : JSON.stringify(data.resultado, null, 2)
        );
        cargarDashboard(token);
      }
    } catch {
      setResultadoCotizacion('Error de red al procesar la cotización.');
    } finally {
      setCargando(false);
    }
  };

  const handleAprobarCotizacion = async (consecutivoCot: string): Promise<void> => {
    if (!token) return;
    if (!window.confirm(`¿Aprobar cotización ${consecutivoCot} y generar contrato formal?`)) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/contratos/aprobar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ consecutivo_cotizacion: consecutivoCot }),
      });
      const data = await res.json();
      alert(data.mensaje || data.detail);
      cargarDashboard(token);
    } finally {
      setCargando(false);
    }
  };

  const handleGenerarContratoDesdeTab = async (): Promise<void> => {
    if (!token || !consecutivoManualContrato.trim()) return;
    setCargando(true);
    setResultadoContrato('');
    try {
      const res = await fetch(`${API_URL}/api/contratos/aprobar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consecutivo_cotizacion: consecutivoManualContrato.trim(),
        }),
      });
      const data = await res.json();
      setResultadoContrato(
        res.ok
          ? `${data.mensaje}\n${JSON.stringify(data.resultado, null, 2)}`
          : `Error: ${data.detail}`
      );
      setConsecutivoManualContrato('');
      cargarDashboard(token);
    } finally {
      setCargando(false);
    }
  };

  const handleProgramarVisita = async (confirmarImpar = false): Promise<void> => {
    if (!token || !visitaProyectoId) return;
    setCargando(true);
    setAlertaImpar('');
    setResultadoVisita(null);
    try {
      const res = await fetch(`${API_URL}/api/visitas/programar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          proyecto_id: Number(visitaProyectoId),
          fecha_visita: visitaFecha || null,
          hora_inicio: visitaHora,
          confirmar_transporte_alternativo_impar: confirmarImpar,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail);
      } else if (data.requiere_confirmacion_impar) {
        setAlertaImpar(data.mensaje);
      } else {
        setResultadoVisita(data as ResultadoVisita);
        cargarDashboard(token);
      }
    } finally {
      setCargando(false);
    }
  };

  const handleEmitirCobro = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!token) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/finanzas/emitir-cobro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consecutivo_contrato: cobroContrato,
          numero_fase: Number(cobroFase),
        }),
      });
      const data = await res.json();
      setResultadoFinanzas(
        res.ok
          ? `${data.mensaje}\n${JSON.stringify(data.resultado, null, 2)}`
          : `Error: ${data.detail}`
      );
    } finally {
      setCargando(false);
    }
  };

  const handleRegistrarPago = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!token) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/finanzas/registrar-pago`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consecutivo_contrato: pagoContrato,
          numero_fase: Number(pagoFase),
          costos_directos_reales: pagoCostosReales ? Number(pagoCostosReales) : null,
        }),
      });
      const data = await res.json();
      setResultadoFinanzas(
        res.ok
          ? `${data.mensaje}\n${JSON.stringify(data.resultado, null, 2)}`
          : `Error: ${data.detail}`
      );
      cargarDashboard(token);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearUsuario = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!token) return;
    setCargando(true);
    setMensajeAjustes('');
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoUsuario),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensajeAjustes(`Error: ${data.detail}`);
      } else {
        setMensajeAjustes(data.mensaje);
        setNuevoUsuario({
          nombre_completo: '',
          correo: '',
          password: '',
          rol: 'COLABORADOR_ALIADO',
          especialidad: '',
          puede_cotizar: true,
          puede_aprobar: false,
        });
        cargarUsuarios(token);
      }
    } finally {
      setCargando(false);
    }
  };

  const handleToggleEstadoUsuario = async (target: UsuarioGestion): Promise<void> => {
    if (!token) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${target.id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activo: !target.activo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensajeAjustes(`Error: ${data.detail}`);
      } else {
        cargarUsuarios(token);
      }
    } finally {
      setCargando(false);
    }
  };

  // ============================================================================
  // PANTALLA DE INICIO DE SESIÓN
  // ============================================================================
  if (!token || !usuario) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img
              src="/logo_ingeopredial.png"
              alt="INGEOPREDIAL S.A.S."
              className="login-logo"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <h1>INGEOPREDIAL S.A.S.</h1>
            <p>Portal Operativo de Ingeniería Catastral y Avalúos</p>
          </div>

          {loginError && <div className="alert-error">{loginError}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Correo Corporativo / Registrado</label>
              <input
                type="email"
                required
                placeholder="usuario@ingeopredial.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={cargando}>
              <ShieldCheck size={18} />
              {cargando ? 'Verificando acceso...' : 'Ingresar al Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const esSocio = usuario.rol === 'SOCIO_ADMIN';
  const totalContratado = proyectos.reduce((acc, p) => acc + (p.valor_total || 0), 0);

  // ============================================================================
  // PORTAL PRINCIPAL
  // ============================================================================
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img
            src="/logo_ingeopredial.png"
            alt="Logo"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <div className="sidebar-brand-text">
            <strong>INGEOPREDIAL</strong>
            <span>S.A.S. • Gestión Técnica</span>
          </div>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-btn ${tab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setTab('dashboard')}
          >
            <LayoutDashboard size={18} /> Panel General
          </button>

          {usuario.puede_cotizar && (
            <button
              className={`nav-btn ${tab === 'cotizador' ? 'active' : ''}`}
              onClick={() => setTab('cotizador')}
            >
              <FileText size={18} /> Cotizador Comercial
            </button>
          )}

          {esSocio && (
            <>
              <button
                className={`nav-btn ${tab === 'contratos' ? 'active' : ''}`}
                onClick={() => setTab('contratos')}
              >
                <CheckCircle2 size={18} /> Contratos
              </button>
              <button
                className={`nav-btn ${tab === 'visitas' ? 'active' : ''}`}
                onClick={() => setTab('visitas')}
              >
                <Calendar size={18} /> Visitas (MWU-296)
              </button>
              <button
                className={`nav-btn ${tab === 'finanzas' ? 'active' : ''}`}
                onClick={() => setTab('finanzas')}
              >
                <DollarSign size={18} /> Finanzas y Cobros
              </button>
              <button
                className={`nav-btn ${tab === 'ajustes' ? 'active' : ''}`}
                onClick={() => {
                  setTab('ajustes');
                  if (token) cargarUsuarios(token);
                }}
              >
                <Settings size={18} /> Ajustes y Usuarios
              </button>
            </>
          )}
        </nav>

        <div className="user-box">
          <strong>{usuario.nombre_completo}</strong>
          <div style={{ color: '#cbd5e1', fontSize: '0.78rem' }}>{usuario.correo}</div>
          <span className="role-badge">{usuario.rol}</span>
          <button className="btn btn-outline" onClick={cerrarSesion}>
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h2>
            {tab === 'dashboard' && 'Tablero Operativo de Proyectos'}
            {tab === 'cotizador' && 'Generador de Cotizaciones Comerciales'}
            {tab === 'contratos' && 'Aprobación y Generación de Contratos'}
            {tab === 'visitas' && 'Cronograma de Campo y Logística MWU-296'}
            {tab === 'finanzas' && 'Facturación (50% / 50%) y Liquidación'}
            {tab === 'ajustes' && 'Administración de Socios y Colaboradores'}
          </h2>
          <span className="normativa-pill">Resolución IGAC 941 de 2026 • EPSG:9377</span>
        </div>

        {mensajeGlobal && <div className="alert-error">{mensajeGlobal}</div>}

        {/* TAB 1: DASHBOARD */}
        {tab === 'dashboard' && (
          <>
            <div className="kpi-grid">
              <div className="kpi-card">
                <span>Expedientes Activos / Cotizados</span>
                <strong>{proyectos.length}</strong>
              </div>
              <div className="kpi-card green">
                <span>Monto Total Gestionado</span>
                <strong>{formatoCOP(totalContratado)}</strong>
              </div>
              {esSocio && (
                <div className="kpi-card">
                  <span>Visitas Técnicas Agendadas</span>
                  <strong>{visitas.length}</strong>
                </div>
              )}
            </div>

            <div className="card">
              <h3>Expedientes y Cotizaciones</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Cotización</th>
                      <th>Contrato</th>
                      <th>Cliente</th>
                      <th>Servicio</th>
                      <th>Valor Total</th>
                      <th>Estado</th>
                      {esSocio && <th>Acción</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {proyectos.length === 0 ? (
                      <tr>
                        <td colSpan={esSocio ? 7 : 6} style={{ textAlign: 'center', padding: '1.5rem' }}>
                          No hay proyectos registrados aún. Cree la primera cotización en el menú lateral.
                        </td>
                      </tr>
                    ) : (
                      proyectos.map((p) => (
                        <tr key={p.id}>
                          <td><strong>{p.consecutivo_cotizacion}</strong></td>
                          <td>{p.consecutivo_contrato || '—'}</td>
                          <td>{p.cliente}</td>
                          <td>{p.tipo_servicio}</td>
                          <td>{formatoCOP(p.valor_total)}</td>
                          <td>
                            <span
                              className={`status-pill ${
                                p.estado?.includes('CONTRATO') || p.estado?.includes('APROBAD')
                                  ? 'aprobado'
                                  : ''
                              }`}
                            >
                              {p.estado}
                            </span>
                          </td>
                          {esSocio && (
                            <td>
                              {!p.consecutivo_contrato ? (
                                <button
                                  className="btn btn-primary"
                                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                                  onClick={() => handleAprobarCotizacion(p.consecutivo_cotizacion)}
                                  disabled={cargando}
                                >
                                  <CheckCircle2 size={15} /> Aprobar y Contratar
                                </button>
                              ) : (
                                <span style={{ color: '#2d8a39', fontWeight: 600, fontSize: '0.82rem' }}>
                                  Contratado
                                </span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: COTIZADOR */}
        {tab === 'cotizador' && (
          <div className="card">
            <h3>Nueva Propuesta Comercial (Word + PDF)</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`btn ${modoCotizacion === 'formulario' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => setModoCotizacion('formulario')}
              >
                Formulario Estructurado
              </button>
              <button
                type="button"
                className={`btn ${modoCotizacion === 'libre' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => setModoCotizacion('libre')}
              >
                Instrucción Rápida con IA
              </button>
            </div>

            <form onSubmit={handleGenerarCotizacion}>
              {modoCotizacion === 'libre' ? (
                <div className="form-group">
                  <label>Describa el requerimiento completo del cliente</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Ej: Cotizar avalúo comercial urbano para apartamento de 85 m2 en Bogotá D.C., Calle 100 # 15-20, cliente Carlos Pérez, CC 79123456, tel 3001234567, correo carlos@correo.com, honorarios $1.400.000..."
                    value={instruccionLibre}
                    onChange={(e) => setInstruccionLibre(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre o Razón Social del Cliente</label>
                      <input
                        required
                        value={cotForm.cliente_nombre}
                        onChange={(e) => setCotForm({ ...cotForm, cliente_nombre: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Cédula o NIT</label>
                      <input
                        required
                        value={cotForm.cliente_documento}
                        onChange={(e) => setCotForm({ ...cotForm, cliente_documento: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono WhatsApp</label>
                      <input
                        required
                        value={cotForm.cliente_telefono}
                        onChange={(e) => setCotForm({ ...cotForm, cliente_telefono: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        value={cotForm.cliente_correo}
                        onChange={(e) => setCotForm({ ...cotForm, cliente_correo: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Municipio</label>
                      <input
                        required
                        value={cotForm.municipio}
                        onChange={(e) => setCotForm({ ...cotForm, municipio: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Dirección / Vereda del Predio</label>
                      <input
                        required
                        value={cotForm.direccion_predio}
                        onChange={(e) => setCotForm({ ...cotForm, direccion_predio: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo de Servicio</label>
                      <select
                        value={cotForm.tipo_servicio}
                        onChange={(e) => setCotForm({ ...cotForm, tipo_servicio: e.target.value })}
                      >
                        <option>Avalúo Comercial Urbano (Res. IGAC 941/2026)</option>
                        <option>Avalúo Comercial Rural / Agropecuario</option>
                        <option>Levantamiento Topográfico GNSS / RTK</option>
                        <option>Trámite Catastral (Englobe / Desenglobe / Rectificación)</option>
                        <option>Consultoría SIG y Ordenamiento Territorial (POT)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Honorarios Propuestos (COP)</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={cotForm.valor_honorarios}
                        onChange={(e) =>
                          setCotForm({ ...cotForm, valor_honorarios: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Alcance Técnico Específico</label>
                    <textarea
                      rows={3}
                      required
                      value={cotForm.descripcion_alcance}
                      onChange={(e) =>
                        setCotForm({ ...cotForm, descripcion_alcance: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary" disabled={cargando}>
                <FileText size={18} />
                {cargando ? 'Generando propuesta...' : 'Generar Cotización Oficial'}
              </button>
            </form>

            {resultadoCotizacion && <div className="result-box">{resultadoCotizacion}</div>}
          </div>
        )}

        {/* TAB 3: CONTRATOS */}
        {tab === 'contratos' && esSocio && (
          <>
            <div className="card">
              <h3>Aprobar Cotización y Emitir Contrato Formal (Word + PDF)</h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1rem' }}>
                Seleccione una cotización pendiente o ingrese su consecutivo para formalizar el contrato de prestación de servicios profesionales (esquema 50% anticipo / 50% entrega).
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label>Cotizaciones Pendientes de Aprobación</label>
                  <select
                    value={consecutivoManualContrato}
                    onChange={(e) => setConsecutivoManualContrato(e.target.value)}
                  >
                    <option value="">-- Seleccione una cotización --</option>
                    {proyectos
                      .filter((p) => !p.consecutivo_contrato)
                      .map((p) => (
                        <option key={p.id} value={p.consecutivo_cotizacion}>
                          {p.consecutivo_cotizacion} — {p.cliente} ({formatoCOP(p.valor_total)})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>O digite el Consecutivo Manualmente</label>
                  <input
                    placeholder="Ej: COT-2026-001"
                    value={consecutivoManualContrato}
                    onChange={(e) => setConsecutivoManualContrato(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                disabled={cargando || !consecutivoManualContrato.trim()}
                onClick={handleGenerarContratoDesdeTab}
              >
                <CheckCircle2 size={18} />
                {cargando ? 'Generando contrato...' : 'Aprobar y Generar Contrato'}
              </button>

              {resultadoContrato && <div className="result-box">{resultadoContrato}</div>}
            </div>

            <div className="card">
              <h3>Contratos Emitidos y Activos</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Contrato</th>
                      <th>Cotización Origen</th>
                      <th>Cliente</th>
                      <th>Servicio</th>
                      <th>Valor Contratado</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectos.filter((p) => p.consecutivo_contrato).length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '1.25rem' }}>
                          Aún no hay contratos aprobados.
                        </td>
                      </tr>
                    ) : (
                      proyectos
                        .filter((p) => p.consecutivo_contrato)
                        .map((p) => (
                          <tr key={p.id}>
                            <td><strong>{p.consecutivo_contrato}</strong></td>
                            <td>{p.consecutivo_cotizacion}</td>
                            <td>{p.cliente}</td>
                            <td>{p.tipo_servicio}</td>
                            <td>{formatoCOP(p.valor_total)}</td>
                            <td>
                              <span className="status-pill aprobado">{p.estado}</span>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TAB 4: VISITAS DE CAMPO (MWU-296) */}
        {tab === 'visitas' && esSocio && (
          <div className="card">
            <h3>Programar Visita de Campo (Validación Pico y Placa Bogotá MWU-296)</h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1rem' }}>
              Si deja la fecha vacía, el sistema calculará automáticamente el próximo <strong>día par</strong>. Si elige un día impar, se activará la alerta preventiva para la placa <strong>MWU-296</strong>.
            </p>

            <div className="form-grid">
              <div className="form-group">
                <label>Seleccionar Proyecto</label>
                <select
                  value={visitaProyectoId}
                  onChange={(e) => setVisitaProyectoId(Number(e.target.value))}
                >
                  {proyectos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.consecutivo_contrato || p.consecutivo_cotizacion} — {p.cliente}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Fecha de Visita (Opcional — vacío = próximo día par)</label>
                <input
                  type="date"
                  value={visitaFecha}
                  onChange={(e) => setVisitaFecha(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Hora de Inicio</label>
                <input
                  type="time"
                  value={visitaHora}
                  onChange={(e) => setVisitaHora(e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleProgramarVisita(false)}
              disabled={cargando}
            >
              <Calendar size={18} /> Validar y Programar Visita
            </button>

            {alertaImpar && (
              <div className="alert-warning">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <AlertTriangle size={20} /> Restricción Vehicular Detectada (Placa MWU-296)
                </div>
                <p style={{ margin: '0.5rem 0 0.85rem' }}>{alertaImpar}</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleProgramarVisita(true)}
                  disabled={cargando}
                >
                  Confirmar Transporte Alternativo y Agendar en Día Impar
                </button>
              </div>
            )}

            {resultadoVisita && (
              <div className="result-box">
                <strong>✅ Visita Agendada:</strong> {resultadoVisita.fecha_agendada} a las{' '}
                {resultadoVisita.hora_inicio} ({resultadoVisita.logistica})
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
                  <a
                    href={resultadoVisita.google_calendar_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <ExternalLink size={16} /> Abrir Google Calendar (3 Socios)
                  </a>
                  <a
                    href={resultadoVisita.whatsapp_cliente_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    <ExternalLink size={16} /> Notificar Cliente por WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FINANZAS */}
        {tab === 'finanzas' && esSocio && (
          <div className="form-grid">
            <div className="card">
              <h3>Emitir Cuenta de Cobro (50% Fase 1 / 50% Fase 2)</h3>
              <form onSubmit={handleEmitirCobro}>
                <div className="form-group">
                  <label>Consecutivo de Contrato</label>
                  <input
                    required
                    placeholder="Ej: CONT-2026-001"
                    value={cobroContrato}
                    onChange={(e) => setCobroContrato(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Fase a Cobrar</label>
                  <select value={cobroFase} onChange={(e) => setCobroFase(Number(e.target.value))}>
                    <option value={1}>Fase 1 — Anticipo (50%)</option>
                    <option value={2}>Fase 2 — Entrega Final (50%)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-secondary" disabled={cargando}>
                  Emitir Cuenta de Cobro
                </button>
              </form>
            </div>

            <div className="card">
              <h3>Registrar Pago Recibido y Liquidar Comisiones</h3>
              <form onSubmit={handleRegistrarPago}>
                <div className="form-group">
                  <label>Consecutivo de Contrato</label>
                  <input
                    required
                    placeholder="Ej: CONT-2026-001"
                    value={pagoContrato}
                    onChange={(e) => setPagoContrato(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Fase Pagada</label>
                  <select value={pagoFase} onChange={(e) => setPagoFase(Number(e.target.value))}>
                    <option value={1}>Fase 1 — Anticipo (50%)</option>
                    <option value={2}>Fase 2 — Entrega Final (50%)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Costos Directos Reales (Opcional, COP)</label>
                  <input
                    type="number"
                    placeholder="Dejar vacío si no aplica"
                    value={pagoCostosReales}
                    onChange={(e) => setPagoCostosReales(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={cargando}>
                  Registrar Pago y Liquidar
                </button>
              </form>
            </div>

            {resultadoFinanzas && (
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h3>Resultado Operación Financiera</h3>
                <div className="result-box">{resultadoFinanzas}</div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: AJUSTES Y GESTIÓN DE USUARIOS */}
        {tab === 'ajustes' && esSocio && (
          <>
            <div className="card">
              <h3>
                <UserPlus size={20} /> Registrar Nuevo Socio o Colaborador Aliado
              </h3>
              <form onSubmit={handleCrearUsuario}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input
                      required
                      placeholder="Ej: Ing. Laura Gómez"
                      value={nuevoUsuario.nombre_completo}
                      onChange={(e) =>
                        setNuevoUsuario({ ...nuevoUsuario, nombre_completo: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Correo Corporativo / Acceso</label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@ingeopredial.com"
                      value={nuevoUsuario.correo}
                      onChange={(e) =>
                        setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Contraseña Inicial</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                      value={nuevoUsuario.password}
                      onChange={(e) =>
                        setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Rol en el Portal</label>
                    <select
                      value={nuevoUsuario.rol}
                      onChange={(e) => {
                        const rol = e.target.value as RolUsuario;
                        setNuevoUsuario({
                          ...nuevoUsuario,
                          rol,
                          puede_cotizar: true,
                          puede_aprobar: rol === 'SOCIO_ADMIN',
                        });
                      }}
                    >
                      <option value="COLABORADOR_ALIADO">COLABORADOR_ALIADO (Comercial / Técnico)</option>
                      <option value="SOCIO_ADMIN">SOCIO_ADMIN (Acceso Total)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Especialidad Técnica</label>
                    <input
                      placeholder="Ej: Topografía GNSS / Avalúos Rurales"
                      value={nuevoUsuario.especialidad}
                      onChange={(e) =>
                        setNuevoUsuario({ ...nuevoUsuario, especialidad: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={nuevoUsuario.puede_cotizar}
                      onChange={(e) =>
                        setNuevoUsuario({ ...nuevoUsuario, puede_cotizar: e.target.checked })
                      }
                    />
                    Permiso para Generar Cotizaciones
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={nuevoUsuario.puede_aprobar}
                      onChange={(e) =>
                        setNuevoUsuario({ ...nuevoUsuario, puede_aprobar: e.target.checked })
                      }
                    />
                    Permiso para Aprobar Contratos
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" disabled={cargando}>
                  <UserPlus size={18} />
                  {cargando ? 'Registrando usuario...' : 'Crear Usuario'}
                </button>
              </form>

              {mensajeAjustes && <div className="result-box">{mensajeAjustes}</div>}
            </div>

            <div className="card">
              <h3>Usuarios Registrados en INGEOPREDIAL S.A.S.</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Especialidad</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosLista.map((u) => (
                      <tr key={u.id}>
                        <td><strong>{u.nombre_completo}</strong></td>
                        <td>{u.correo}</td>
                        <td>{u.rol}</td>
                        <td>{u.especialidad || '—'}</td>
                        <td>
                          <span className={`status-pill ${u.activo ? 'aprobado' : ''}`}>
                            {u.activo ? 'ACTIVO' : 'INACTIVO'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            disabled={cargando || u.id === usuario.id}
                            onClick={() => handleToggleEstadoUsuario(u)}
                          >
                            {u.activo ? 'Desactivar' : 'Reactivar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;