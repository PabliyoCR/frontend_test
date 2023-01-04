import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CierresComponent } from './pages/cierres/cierres.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { CopiasComponent } from './pages/copias/copias.component';
import { GastosComponent } from './pages/gastos/gastos.component';
import { MetasComponent } from './pages/metas/metas.component';
import { RutasComponent } from './pages/rutas/rutas.component';
import { HomeComponent } from './pages/home/home.component';
import { LogInComponent } from './auth/logIn/logIn.component';
import { AdminComponent } from './pages/admin/admin.component';

const routes: Routes = [
  {
    path: 'logIn',
    component: LogInComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'rutas',
    component: RutasComponent,
  },
  {
    path: 'gastos',
    component: GastosComponent,
  },
  {
    path: 'cierres',
    component: CierresComponent,
  },
  {
    path: 'copias',
    component: CopiasComponent,
  },
  {
    path: 'metas',
    component: MetasComponent,
  },
  {
    path: 'clientes',
    component: ClientesComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
