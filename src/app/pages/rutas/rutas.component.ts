import { Component, OnInit, ViewChild } from '@angular/core';
import { Zona } from 'src/app/models/cliente.model';
import { DiaPago, StatusTarjeta, TARJETA } from 'src/app/models/tarjeta.model';
import { TarjetasService } from 'src/app/shared/services/tarjetas.service';
import { TarjetaViewComponent } from '../tarjetas/tarjeta-view/tarjeta-view.component';
import { ModalController } from '@ionic/angular';
import { EnrutarComponent } from './enrutar/enrutar.component';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.scss'],
})
export class RutasComponent implements OnInit {
  rutas = Object.keys(Zona);
  rutaSeleccionada = '';
  tarjetas: TARJETA[] = [];
  tarjetasAux: TARJETA[] = [];

  @ViewChild('tabs') tabs!: MatTabGroup;
  tabIdx = 0;

  Zona = Zona;
  DiaPago = DiaPago;
  StatusTarjeta = StatusTarjeta;

  constructor(
    private tarjetasService: TarjetasService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.tarjetasService.getTarjetas().subscribe((res) => {
      this.tarjetasAux = res;
      this.seleccionarRuta(this.tabIdx - 1);
    });
  }

  seleccionarRuta(idx: number) {
    this.tabIdx = idx + 1;
    this.rutaSeleccionada = this.rutas[idx];
    this.tarjetas = this.tarjetasAux.filter(
      (tarjeta) => tarjeta.cliente.zona === this.rutaSeleccionada
    );
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

  async openEnrutar() {
    const modal = await this.modalController.create({
      component: EnrutarComponent,
      componentProps: {
        ruta: this.rutaSeleccionada,
      },
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.tarjetasService.tarjetasQuery.refetch();
    });
  }

  tabChange(e: MatTabChangeEvent) {
    this.seleccionarRuta(e.index - 1);
  }

  call(e: Event, numero: number) {
    e.stopPropagation();
    document.location.href = `tel:${numero}`;
  }
}
