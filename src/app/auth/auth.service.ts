import { Injectable } from '@angular/core';
import { Apollo, MutationResult, gql } from 'apollo-angular';
import { LogInDTO, SignUpDTO, UserProfile } from './auth.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userProfile = new BehaviorSubject<UserProfile | null>(null);
  jwtService: JwtHelperService = new JwtHelperService();
  usuarioActualId = '';

  constructor(
    private apollo: Apollo,
    private router: Router,
    private storage: Storage
  ) {
    this.init();
  }

  async init() {
    await this.storage.create();
    this.userProfile.subscribe((res) => {
      this.usuarioActualId = res?.sub ? res.sub : '';
    });
    this.getAccessToken();
  }

  logIn(logInDTO: LogInDTO): Observable<MutationResult> {
    const { email, password } = logInDTO;
    return this.apollo.mutate<MutationResult>({
      mutation: gql`
        mutation ($input: LogInUserInput!) {
          result: logIn(input: $input) {
            access_token
          }
        }
      `,
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  }

  logout() {
    this.router.navigate(['/logIn']);
    this.storage.remove('token');
    this.apollo.client.resetStore();
    this.userProfile.next(null);
  }

  signUp(signUpDTO: SignUpDTO): Observable<MutationResult> {
    const { email, password, firstName, lastName } = signUpDTO;
    return this.apollo.mutate<MutationResult>({
      mutation: gql`
        mutation ($input: CreateUserInput!) {
          result: signUp(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          email,
          password,
          firstName,
          lastName,
        },
      },
    });
  }

  async registerToken(token: string) {
    this.storage.set('token', token);
    let userInfo = this.jwtService.decodeToken(token) as UserProfile;
    this.userProfile.next(userInfo);
  }

  async getAccessToken(): Promise<string> {
    // TODO: Use refresh token
    //var storageToken = storageToken.getItem('tokens');
    var storageToken = await this.storage.get('token');
    if (storageToken) {
      //var token = JSON.parse(storageToken) as TokenModel;
      var token = storageToken;
      //var isTokenExpired = this.jwtService.isTokenExpired(token.access_token);
      var isTokenExpired = this.jwtService.isTokenExpired(token);
      if (isTokenExpired) {
        this.logout();
        return '';
      }
      var userInfo = this.jwtService.decodeToken(
        //token.access_token
        token
      ) as UserProfile;
      this.userProfile.next(userInfo);
      //return token.access_token;
      return token;
    } else {
      if (this.router.url !== '/signUp') {
        this.router.navigate(['/logIn']);
      }
      return '';
    }
  }
}
