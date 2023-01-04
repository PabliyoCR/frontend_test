import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Page } from './shared/types/Page.model';
import { ConfigurationService } from './shared/services/configuration.service';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { HomeComponent } from './pages/home/home.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appPages: Page[] = [];
  currentPageIdx = 0;
  component = HomeComponent;
  username!: string;
  caja!: string;

  constructor(
    private platform: Platform,
    public router: Router,
    private location: Location,
    private configurationService: ConfigurationService,
    private authService: AuthService
  ) {
    //Obtener paginas del menu
    this.appPages = configurationService.getPages();
    // TODO: Cambiar por observable
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentPageIdx = this.appPages.findIndex(
          (page) => page.url == val.urlAfterRedirects
        );
      }
    });
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.router.url !== '/') {
        this.goBack();
      } else {
        App.exitApp();
      }
    });
    this.authService.userProfile.subscribe((res) => {
      if (res?.email) {
        this.username = res.nombre;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  logOut() {
    this.authService.logout();
  }
}
