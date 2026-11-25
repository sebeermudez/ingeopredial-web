export type RolUsuario = 'SOCIO_ADMIN' | 'COLABORADOR_ALIADO';

export type TabActivo =
  | 'dashboard'
  | 'cotizador'
  | 'contratos'
  | 'visitas'
  | 'finanzas'
  | 'contratistas'
  | 'cxp'
  | 'liquidaciones'
  | 'ajustes';

export interface Usuario {
  id: number;
  nombre_completo: string;
  correo: string;
  rol: RolUsuario;
  especialidad?: string;
  puede_cotizar: boolean;
  puede_aprobar: boolean;
}

export interface UsuarioGestion extends Usuario {
  activo: boolean;
}

export interface Proyecto {
  id: number;
  consecutivo_cotizacion: string;
  consecutivo_contrato?: string;
  tipo_servicio: string;
  estado: string;
  valor_total: number;
  utilidad_neta_estimada?: number;
  fecha_creacion: string;
  cliente: string;
  gestor?: string;
}

export interface Visita {
  id: number;
  fecha_visita: string;
  hora_inicio: string;
  estado: string;
  consecutivo_contrato: string;
  cliente: string;
  direccion: string;
  municipio: string;
}

export interface ResultadoVisita {
  ok: boolean;
  fecha_agendada: string;
  hora_inicio: string;
  logistica: string;
  google_calendar_url: string;
  whatsapp_cliente_url: string;
}