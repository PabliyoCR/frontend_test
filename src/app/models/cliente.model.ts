import { TARJETA } from './tarjeta.model';

export enum Zona {
  grecia = 'Grecia',
  sarchi = 'Sarchí',
  naranjo = 'Naranjo',
  palmares = 'Palmares',
  san_ramon = 'San Ramón',
}

export interface Direccion {
  latitud: number;
  longitud: number;
}

export interface CLIENTE {
  id: string;
  nombre: string;
  c_c: string;
  zona: string;
  contacto: number[];
  direccion: Direccion;
  tarjetas: TARJETA[];
  totalDeudas: number;
}

export type ClientesQuery = {
  clientes: CLIENTE[];
};

export type ClienteQuery = {
  cliente: CLIENTE;
};

export interface CreateClienteDTO {
  nombre: string;
  c_c: string;
  contacto: number[];
  zona: string;
  direccion: Direccion;
}

export interface UpdateClientesDTO extends CreateClienteDTO {
  id: string;
}
