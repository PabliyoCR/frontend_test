export enum ConceptoGasto {
  gasolina = 'Gasolina',
  salario = 'Salario',
  recargas = 'Recargas',
  ahorros = 'Ahorros',
  otros = 'Otros',
}

export interface Gasto {
  concepto: ConceptoGasto;
  monto: number;
  descripcion: string;
}

export interface USER {
  id: string;
  nombre: string;
  email: string;
  dineroRecaudadoHoy: number;
  dineroPrestadoHoy: number;
  dineroPrestadoMes: number;
  clientesQuePagaronHoy: number;
  clientesQueNoPagaronHoy: number;
  caja?: number;
  cajaInicio?: number;
  cajaFin?: number;
  gastos: Gasto[];
  totalGastos: number;
}

export type UserQuery = {
  user: USER;
};
