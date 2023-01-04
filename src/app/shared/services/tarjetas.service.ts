import { Injectable } from '@angular/core';
import { Apollo, MutationResult, QueryRef, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
  CreateAbonoDTO,
  CreateTarjetaDTO,
  TARJETA,
  TarjetaQuery,
  TarjetasQuery,
  UpdateTarjetaDTO,
} from 'src/app/models/tarjeta.model';

@Injectable({
  providedIn: 'root',
})
export class TarjetasService {
  tarjetasQuery!: QueryRef<TarjetasQuery>;
  singleTarjetaQuery!: QueryRef<TarjetaQuery>;

  constructor(private apollo: Apollo) {}

  getTarjetas(): Observable<TARJETA[]> {
    this.tarjetasQuery = this.apollo.watchQuery<TarjetasQuery>({
      query: gql`
        query {
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
            cliente {
              id
              nombre
              direccion
              contacto
              c_c
              zona
              totalDeudas
            }
          }
        }
      `,
    });
    return this.tarjetasQuery.valueChanges.pipe(
      map((result) => result.data.tarjetas)
    );
  }

  getTarjetaById(tarjetaId: string): Observable<TARJETA> {
    this.singleTarjetaQuery = this.apollo.watchQuery<TarjetaQuery>({
      query: gql`
        query ($tarjetaId: String!) {
          tarjeta(id: $tarjetaId) {
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
            cliente {
              id
              nombre
              direccion
              contacto
              c_c
              zona
              totalDeudas
            }
          }
        }
      `,
      variables: {
        tarjetaId,
      },
    });
    return this.singleTarjetaQuery.valueChanges.pipe(
      map((result) => result.data.tarjeta)
    );
  }

  createTarjeta(
    createTarjetaDTO: CreateTarjetaDTO,
    refinanciada: boolean
  ): Observable<MutationResult> {
    const {
      clienteId,
      dia_de_pago,
      interes,
      numero_cuotas,
      prestamo_sin_interes,
    } = createTarjetaDTO;
    return this.apollo.mutate({
      mutation: gql`
        mutation ($input: CreateTarjetaInput!, $refinanciada: Boolean!) {
          createTarjeta(input: $input, refinanciada: $refinanciada) {
            id
          }
        }
      `,
      variables: {
        input: {
          clienteId,
          dia_de_pago,
          interes,
          numero_cuotas,
          prestamo_sin_interes,
        },
        refinanciada,
      },
    });
  }

  actualizarTarjeta(
    updateTarjetaDTO: UpdateTarjetaDTO
  ): Observable<MutationResult> {
    const {
      id,
      dia_de_pago,
      interes,
      numero_cuotas,
      prestamo_sin_interes,
      valorCuota,
    } = updateTarjetaDTO;

    return this.apollo.mutate({
      mutation: gql`
        mutation ($input: UpdateTarjetaInput!) {
          updateTarjeta(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          id,
          dia_de_pago,
          interes,
          numero_cuotas,
          prestamo_sin_interes,
          valorCuota,
        },
      },
    });
  }

  actualizarPosicionesTarjeta(tarjetasId: string[], posiciones: number[]) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($posiciones: [Int!]!, $tarjetasId: [String!]!) {
          updatePosicionTarjetas(
            posiciones: $posiciones
            tarjetasId: $tarjetasId
          )
        }
      `,
      variables: {
        tarjetasId,
        posiciones,
      },
    });
  }

  createAbono(createAbonoDTO: CreateAbonoDTO): Observable<MutationResult> {
    const { tarjetaId, cantidad_abonada } = createAbonoDTO;
    return this.apollo.mutate({
      mutation: gql`
        mutation ($input: CreateAbonoInput!) {
          createAbono(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          tarjetaId,
          cantidad_abonada,
        },
      },
    });
  }
}
