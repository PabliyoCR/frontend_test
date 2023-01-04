import { Injectable } from '@angular/core';
import { Page } from '../types/Page.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  appPages: Page[] = [
    { title: 'Rutas', url: '/rutas', icon: 'compass', image: 'route' },
    { title: 'Gastos', url: '/gastos', icon: 'wallet', image: 'bills' },
    { title: 'Cierres', url: '/cierres', icon: 'analytics', image: 'count' },
    {
      title: 'Respaldo',
      url: '/copias',
      icon: 'save',
      image: 'copy',
    },
    { title: 'Metas', url: '/metas', icon: 'golf', image: 'goal' },
    { title: 'Clientes', url: '/clientes', icon: 'people', image: 'customers' },
    {
      title: 'Administración',
      url: '/admin',
      icon: 'settings',
      image: 'admin',
    },
  ];

  constructor() {}

  getPages(): Page[] {
    return this.appPages;
  }
}
