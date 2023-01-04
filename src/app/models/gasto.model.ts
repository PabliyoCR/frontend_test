export enum TipoGasto {
  ahorro = 'ahorro',
  otros = 'otros',
}

export interface GASTO {
  tipo: TipoGasto;
  cantidad: number;
  descripcion: string;
}
