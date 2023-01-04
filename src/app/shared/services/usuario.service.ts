import { Injectable } from '@angular/core';
import { Apollo, MutationResult, QueryRef, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Gasto, USER, UserQuery } from 'src/app/models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private apollo: Apollo) {}

  singleUserQuery!: QueryRef<UserQuery>;

  getUsuarioById(userId: string): Observable<USER> {
    this.singleUserQuery = this.apollo.watchQuery<UserQuery>({
      query: gql`
        query ($userId: String!) {
          user(id: $userId) {
            id
            nombre
            email
            role
            dineroPrestadoHoy
            dineroPrestadoMes
            dineroRecaudadoHoy
            clientesQuePagaronHoy
            clientesQueNoPagaronHoy
            gastos
            totalGastos
          }
        }
      `,
      variables: {
        userId,
      },
    });

    return this.singleUserQuery.valueChanges.pipe(
      map((result) => result.data.user)
    );
  }

  actualizarGastos(id: string, gastos: Gasto[]): Observable<MutationResult> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($input: UpdateUserInput!) {
          updateUser(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          id,
          gastos,
        },
      },
    });
  }
}
