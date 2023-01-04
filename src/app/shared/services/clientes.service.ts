import { Injectable } from '@angular/core';
import { Apollo, MutationResult, QueryRef, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
  CLIENTE,
  ClienteQuery,
  ClientesQuery,
  CreateClienteDTO,
  UpdateClientesDTO,
} from 'src/app/models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  clientesQuery!: QueryRef<ClientesQuery>;
  singleClienteQuery!: QueryRef<ClienteQuery>;

  constructor(private apollo: Apollo) {
    /*apollo
      .subscribe({
        query: gql`
          subscription {
            clientes {
              id
            }
          }
        `,
      })
      .subscribe((result) => {
        this.clientesQuery.refetch();
      });*/
  }

  getClientes(): Observable<CLIENTE[]> {
    this.clientesQuery = this.apollo.watchQuery<ClientesQuery>({
      query: gql`
        query {
          clientes {
            id
            nombre
            c_c
            contacto
            totalDeudas
            direccion
            zona
            tarjetas {
              id
              numero
              prestamo_sin_interes
              interesesGanados
              dia_de_pago
              fecha_de_prestamo
              interes
              statusTarjeta
              deuda
              numero_cuotas
              valorCuota
              abonos {
                id
                fecha_pago
                cantidad_abonada
              }
              totalAbonado
              cuotasPagadas
              saldoPendiente
              cuotasPendientes
              saldoAFavor
              abonoHoy
            }
          }
        }
      `,
    });

    return this.clientesQuery.valueChanges.pipe(
      map((result) => result.data.clientes)
    );
  }

  getClienteById(clienteId: string): Observable<CLIENTE> {
    this.singleClienteQuery = this.apollo.watchQuery<ClienteQuery>({
      query: gql`
        query ($clienteId: String!) {
          cliente(id: $clienteId) {
            id
            nombre
            c_c
            contacto
            totalDeudas
            direccion
            zona
            tarjetas {
              id
              numero
              prestamo_sin_interes
              interesesGanados
              dia_de_pago
              fecha_de_prestamo
              interes
              statusTarjeta
              deuda
              numero_cuotas
              valorCuota
              abonos {
                id
                fecha_pago
                cantidad_abonada
              }
              totalAbonado
              cuotasPagadas
              saldoPendiente
              cuotasPendientes
              saldoAFavor
              abonoHoy
            }
          }
        }
      `,
      variables: {
        clienteId,
      },
    });
    return this.singleClienteQuery.valueChanges.pipe(
      map((result) => result.data.cliente)
    );
  }

  createCliente(
    createClienteDTO: CreateClienteDTO
  ): Observable<MutationResult> {
    const { nombre, c_c, contacto, direccion, zona } = createClienteDTO;
    return this.apollo.mutate({
      mutation: gql`
        mutation ($input: CreateClienteInput!) {
          createCliente(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          nombre,
          c_c,
          contacto,
          direccion,
          zona,
        },
      },
    });
  }

  actualizarCliente(
    updateClienteDTO: UpdateClientesDTO
  ): Observable<MutationResult> {
    const { id, nombre, c_c, contacto, direccion, zona } = updateClienteDTO;
    return this.apollo.mutate({
      mutation: gql`
        mutation ($input: UpdateClienteInput!) {
          updateCliente(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          id,
          nombre,
          c_c,
          contacto,
          direccion,
          zona,
        },
      },
    });
  }
}
