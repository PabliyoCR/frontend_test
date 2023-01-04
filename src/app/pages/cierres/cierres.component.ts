import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonToggle, ModalController } from '@ionic/angular';
import {
  DiaPago,
  Interes,
  StatusTarjeta,
  TARJETA,
} from 'src/app/models/tarjeta.model';
import { TarjetasService } from 'src/app/shared/services/tarjetas.service';
import { TarjetaViewComponent } from '../tarjetas/tarjeta-view/tarjeta-view.component';
import { ConceptoGasto, USER } from 'src/app/models/usuario.model';
import { Zona } from 'src/app/models/cliente.model';
import { FechaPipe } from 'src/app/shared/pipes/fecha.pipe';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuthService } from 'src/app/auth/auth.service';
import { GetEnumValuePipe } from 'src/app/shared/pipes/get-enum-value.pipe';
import { ColonesPipe } from 'src/app/shared/pipes/colones.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cierres',
  templateUrl: './cierres.component.html',
  styleUrls: ['./cierres.component.scss'],
})
export class CierresComponent implements OnInit {
  fecha = this.fechaPipe.transform(new Date());
  tarjetas!: TARJETA[];
  tarjetasAux!: TARJETA[];
  usuarioActual!: USER;

  cierreAlert!: HTMLIonAlertElement;

  DiaPago = DiaPago;
  Zona = Zona;
  Interes = Interes;
  StatusTarjeta = StatusTarjeta;
  ConceptoGasto = ConceptoGasto;

  @ViewChild('pagadas') pagadasToggle!: IonToggle;
  @ViewChild('noPagaron') noPagaronToggle!: IonToggle;
  @ViewChild('siPagaron') siPagaronToggle!: IonToggle;
  @ViewChild('refinanciadas') refinanciadasToggle!: IonToggle;

  constructor(
    private tarjetasService: TarjetasService,
    private alertController: AlertController,
    private modalController: ModalController,
    private authService: AuthService,
    private usuarioServices: UsuarioService,
    private colonesPipe: ColonesPipe,
    private fechaPipe: FechaPipe,
    private getEnumValuePipe: GetEnumValuePipe,
    private router: Router
  ) {}

  ngOnInit() {
    this.tarjetasService.getTarjetas().subscribe((result) => {
      this.tarjetas = result;
      this.tarjetasAux = this.tarjetas;
    });
    this.usuarioServices
      .getUsuarioById(this.authService.usuarioActualId)
      .subscribe((res) => {
        this.usuarioActual = res;
        this.showDetail();
      });
  }

  filtrar() {
    let tarjetasFiltradas = this.tarjetasAux;
    if (!this.noPagaronToggle.checked) {
      tarjetasFiltradas = tarjetasFiltradas.filter((tarjeta) => {
        return tarjeta.abonoHoy;
      });
    }
    if (!this.siPagaronToggle.checked) {
      tarjetasFiltradas = tarjetasFiltradas.filter((tarjeta) => {
        return !tarjeta.abonoHoy;
      });
    }
    if (!this.refinanciadasToggle.checked) {
      tarjetasFiltradas = tarjetasFiltradas.filter((tarjeta) => {
        return (
          this.getEnumValuePipe.transform(
            tarjeta.statusTarjeta,
            StatusTarjeta
          ) !== StatusTarjeta.refinanciada
        );
      });
    }
    if (!this.pagadasToggle.checked) {
      tarjetasFiltradas = tarjetasFiltradas.filter((tarjeta) => {
        return (
          this.getEnumValuePipe.transform(
            tarjeta.statusTarjeta,
            StatusTarjeta
          ) !== StatusTarjeta.pagada
        );
      });
    }
    this.tarjetas = tarjetasFiltradas;
  }

  async showDetail() {
    if (this.router.url === '/cierres' && !this.cierreAlert) {
      this.cierreAlert = await this.alertController.create({
        header: 'Contabilidad del día',
        subHeader: `${this.fecha}`,
        message: `
                <div class="mb-4">
                  Total Dinero Prestado:
                  <b>${this.colonesPipe.transform(
                    this.usuarioActual.dineroPrestadoHoy
                  )}</b>
                </div>
                <div>
                  Caja Inicio:
                  <b></b>
                </div>
                <div class="mb-4">
                  Caja Cierre:
                  <b></b>
                </div>
                <div>
                  Saldo Caja:
                  <b></b>
                </div>
                <div>
                  Entrada Caja:
                  <b></b>
                </div>
              `,
        buttons: ['VER CIERRE COMPLETO'],
      });
      await this.cierreAlert.present();
    }
  }

  async openTarjeta(tarjetaId: string) {
    const modal = await this.modalController.create({
      component: TarjetaViewComponent,
      componentProps: {
        tarjetaId,
      },
    });
    modal.present();
  }

  checkTarjetaRefinanciada(status: string): boolean {
    if (status === 'refinanciada') {
      return true;
    }
    return false;
  }

  checkTarjetaPagada(status: string): boolean {
    if (status === 'pagada') {
      return true;
    }
    return false;
  }

  call(e: Event, numero: number) {
    e.stopPropagation();
    document.location.href = `tel:${numero}`;
  }
}
