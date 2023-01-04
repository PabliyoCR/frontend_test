import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpLink } from 'apollo-angular/http';
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './auth/auth.service';
import { LogInComponent } from './auth/logIn/logIn.component';
import { SignUpComponent } from './auth/signUp/signUp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Storage, Drivers } from '@ionic/storage';
import { MatTabsModule } from '@angular/material/tabs';
import { WebSocketLink } from '@apollo/client/link/ws';

import { SwiperModule } from 'swiper/angular';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CierresComponent } from './pages/cierres/cierres.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ClienteFormComponent } from './pages/clientes/cliente-form/cliente-form.component';
import { ClienteViewComponent } from './pages/clientes/cliente-view/cliente-view.component';
import { CopiasComponent } from './pages/copias/copias.component';
import { GastosComponent } from './pages/gastos/gastos.component';
import { MetasComponent } from './pages/metas/metas.component';
import { RutasComponent } from './pages/rutas/rutas.component';
import { TarjetaFormComponent } from './pages/tarjetas/tarjeta-form/tarjeta-form.component';
import { TarjetaViewComponent } from './pages/tarjetas/tarjeta-view/tarjeta-view.component';

import { IonicStorageModule } from '@ionic/storage-angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { GetEnumValuePipe } from './shared/pipes/get-enum-value.pipe';
import { FechaPipe } from './shared/pipes/fecha.pipe';
import { ColonesPipe } from './shared/pipes/colones.pipe';
import { RefinanciamientoFormComponent } from './pages/tarjetas/refinanciamiento-form/refinanciamiento-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EnrutarComponent } from './pages/rutas/enrutar/enrutar.component';
import { ServiceWorkerModule } from '@angular/service-worker';

const basic = setContext((operation, context) => ({
  headers: {
    'Access-Control-Allow-Origin': '*',
    'access-control-allow-credentials': 'true',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
}));

//const ws = new WebSocketLink({
//  uri: 'ws://137.184.228.88:4001/graphql',
//  options: {
//    reconnect: true,
//    connectionParams: {
//      headers: {
//        Authorization: `Bearer ${localStorage.getItem('token')}`,
//      },
//    },
//  },
//});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations }) => {
      // TODO: error handling
      //if (name === 'INVALID_TOKEN') {
      //  this.session.destroy();
      //}
      //if (name === 'UNAUTHENTICATED') {
      //  this.session.destroy();
      //}
      console.error(`[Error]: Message: ${message}, Location: ${locations}`);
    });

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

export function jwtOptionFactor(authService: AuthService) {
  return {
    tokenGetter: () => {
      return authService.getAccessToken();
    },
    // TODO: Usar variables de entorno
    // allowedDomains: ['http://137.184.228.88:4001'],
    //disallowedRoutes: ['http://localhost:4000/logIn'],
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    SignUpComponent,
    HomeComponent,
    AdminComponent,
    CierresComponent,
    ClientesComponent,
    ClienteFormComponent,
    ClienteViewComponent,
    CopiasComponent,
    GastosComponent,
    MetasComponent,
    RutasComponent,
    EnrutarComponent,
    TarjetaFormComponent,
    TarjetaViewComponent,
    RefinanciamientoFormComponent,
    GetEnumValuePipe,
    FechaPipe,
    ColonesPipe,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ApolloModule,
    GoogleMapsModule,
    IonicStorageModule.forRoot({}),
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionFactor,
        deps: [AuthService, Storage],
      },
    }),
    ReactiveFormsModule,
    SwiperModule,
    BrowserAnimationsModule,
    MatTabsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(
        httpLink: HttpLink,
        storage: Storage
      ): ApolloClientOptions<any> {
        return {
          // TODO: modificar esto en base a variables de entorno
          //connectToDevTools: true,
          assumeImmutableResults: true,
          cache: new InMemoryCache(),
          link: ApolloLink.from([
            basic,
            setContext(async (operation, context) => {
              const token = await storage.get('token');
              if (token === null) {
                return {};
              } else {
                return {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                };
              }
            }),
            errorLink,
            httpLink.create({
              uri: 'api',
              withCredentials: true,
            }),
          ]),
        };
      },
      deps: [HttpLink, Storage],
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ColonesPipe,
    FechaPipe,
    GetEnumValuePipe,
    Geolocation,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
