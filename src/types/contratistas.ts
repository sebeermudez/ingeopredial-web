import type { Proyecto } from './ingeopredial';

/** Flags tributarios/booleanos: Turso los guarda como 0/1 (o texto heredado 'SI'/'NO'). */
export type FlagSql = number | string | boolean | null;

export interface Contratista {
  id: number;
  usuario_id?: number | null;
  nombre_completo: string;
  tipo_documento?: string | null;
  documento_nit: string;
  telefono: string;
  correo: string;
  especialidad: string;
  matricula_profesional?: string | null;
  registro_raa?: string | null;
  ciudad_base: string;
  departamento_cobertura: string;
  tipo_persona?: string | null;
  declarante_renta?: FlagSql;
  regimen_simple?: FlagSql;
  aplica_art_383?: FlagSql;
  responsable_iva?: FlagSql;
  banco?: string | null;
  tipo_cuenta?: string | null;
  numero_cuenta?: string | null;
  tarifa_referencia_cop?: number | null;
  unidad_tarifa?: string | null;
  token_registro?: string | null;
  estado_registro?: string | null;
  ruta_rut?: string | null;
  ruta_cedula?: string | null;
  ruta_cert_bancaria?: string | null;
  ruta_matricula_raa?: string | null;
  calificacion_interna?: number | null;
  notas?: string | null;
  fecha_creacion?: string | null;
  total_cxp?: number;
  saldo_pendiente_cop?: number;
}

export interface CxpContratista {
  id: number;
  proyecto_id: number;
  hito_pago_id?: number | null;
  contratista_id: number;
  concepto: string;
  valor_bruto: number;
  porcentaje_retefuente?: number | null;
  valor_retefuente?: number | null;
  porcentaje_reteica?: number | null;
  valor_reteica?: number | null;
  valor_neto_pagar: number;
  estado?: string | null;
  tiene_rut?: number | null;
  tiene_cuenta_cobro?: number | null;
  tiene_pila?: number | null;
  fecha_causacion?: string | null;
  fecha_pago?: string | null;
  comprobante_ruta?: string | null;
  // Campos enriquecidos por el backend (JOIN)
  contratista_nombre?: string | null;
  contratista_documento?: string | null;
  contratista_especialidad?: string | null;
  contratista_banco?: string | null;
  contratista_tipo_cuenta?: string | null;
  contratista_numero_cuenta?: string | null;
  consecutivo_cotizacion?: string | null;
  consecutivo_contrato?: string | null;
  tipo_servicio?: string | null;
  cliente?: string | null;
}

export interface ResumenCxp {
  bruto: number;
  retenciones: number;
  neto: number;
  pendiente: number;
  pagado: number;
}

export interface Liquidacion {
  id?: number;
  proyecto_id: number;
  ingreso_bruto: number;
  costos_directos_operativos: number | null;
  honorarios_tecnicos_externos: number | null;
  utilidad_neta_base: number;
  comision_comercial_cop: number | null;
  porcentaje_comision_aplicado: number | null;
  utilidad_despues_comision: number;
  reserva_operativa_cop: number | null;
  aporte_capitalizacion_cop: number | null;
  utilidad_distribuible_socios: number;
  estado_liquidacion: string | null;
  fecha_calculo?: string | null;
  consecutivo_cotizacion?: string | null;
  consecutivo_contrato?: string | null;
  cliente?: string | null;
}

export interface DetalleLiquidacion {
  proyecto: {
    id: number;
    consecutivo_cotizacion: string;
    consecutivo_contrato: string | null;
    tipo_servicio: string;
    estado: string;
    valor_total: number;
    cliente: string | null;
  };
  liquidacion: Liquidacion | null;
  calculo_actual: Liquidacion;
  fuente_ingreso: 'VALOR_PROYECTO' | 'SUMA_HITOS';
  hitos: { total: number; cobrados_cop: number; pagados_cop: number; pendientes: number };
  cxp: { total: number; pagadas: number; bruto_cop: number; neto_cop: number; pendiente_neto_cop: number };
}

/** Props comunes de las vistas financieras nuevas. */
export interface VistaFinancieraProps {
  token: string;
  apiUrl: string;
  proyectos: Proyecto[];
  onSesionExpirada: () => void;
}
