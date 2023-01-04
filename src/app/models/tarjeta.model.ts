import { CLIENTE } from './cliente.model';

export enum StatusTarjeta {
  nueva = 'Nueva',
  pendiente = 'Pendiente',
  refinanciada = 'Refinanciada',
  pagada = 'Pagada',
}

export enum DiaPago {
  diario = 'Diario',
  lunes = 'Lunes',
  martes = 'Martes',
  miercoles = 'Miercoles',
  jueves = 'Jueves',
  viernes = 'Viernes',
  sabado = 'Sabado',
  domingo = 'Domingo',
  quincenal = 'Quincenal',
}

export enum Interes {
  veinte = 20,
  treinta = 30,
  cuarenta = 40,
}

export enum NumeroCuotas {
  veinticuatro = 24,
  treinta = 30,
}

export interface ABONO {
  tarjeta: TARJETA;
  cantidad_abonada: number;
  fecha_pago: Date;
}

export interface TARJETA {
  id: string;
  numero: number;
  cliente: CLIENTE;
  statusTarjeta: StatusTarjeta;
  dia_de_pago: DiaPago;
  fecha_de_prestamo: Date;
  prestamo_sin_interes: number;
  interes: Interes;
  numero_cuotas: NumeroCuotas;
  abonos: ABONO[];
  deuda: number;
  interesesGanados: number;
  valorCuota: number;
  totalAbonado: number;
  cuotasPagadas: number;
  saldoPendiente: number;
  cuotasPendientes: number;
  saldoAFavor: number;
  abonoHoy: boolean;
}

export type TarjetasQuery = {
  tarjetas: TARJETA[];
};

export type TarjetaQuery = {
  tarjeta: TARJETA;
};

export interface CreateTarjetaDTO {
  clienteId: string;
  dia_de_pago: DiaPago;
  interes: Interes;
  prestamo_sin_interes: number;
  numero_cuotas: NumeroCuotas;
}

export interface UpdateTarjetaDTO {
  id: string;
  dia_de_pago: DiaPago;
  interes: Interes;
  prestamo_sin_interes: number;
  numero_cuotas: NumeroCuotas;
  valorCuota: number;
}

export interface CreateAbonoDTO {
  tarjetaId: string;
  cantidad_abonada: number;
}
