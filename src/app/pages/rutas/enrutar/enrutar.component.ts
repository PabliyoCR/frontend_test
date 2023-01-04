import { Component, OnInit } from '@angular/core';
import { ItemReorderEventDetail, ModalController } from '@ionic/angular';
import { TARJETA } from 'src/app/models/tarjeta.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TarjetasService } from 'src/app/shared/services/tarjetas.service';

@Component({
  selector: 'app-enrutar',
  templateUrl: './enrutar.component.html',
  styleUrls: ['./enrutar.component.scss'],
})
export class EnrutarComponent implements OnInit {
  ruta = '';
  tarjetas: TARJETA[] = [];

  constructor(
    private modalController: ModalController,
    private tarjetasService: TarjetasService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.tarjetasService.getTarjetas().subscribe((res) => {
      this.tarjetas = res.filter(
        (tarjeta) => tarjeta.cliente.zona === this.ruta
      );
    });
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.tarjetas = ev.detail.complete(this.tarjetas);
    ev.detail.complete();
  }

  setEnrutamiento() {
    let ids: string[] = [];
    let positions: number[] = [];
    this.tarjetas.forEach((tarjeta, idx) => {
      ids.push(tarjeta.id);
      positions.push(idx);
    });
    this.tarjetasService
      .actualizarPosicionesTarjeta(ids, positions)
      .subscribe((res) => {
        this.alertService.toast('Enrutar Actualizado');
        this.tarjetasService.tarjetasQuery.refetch();
        this.close();
      });
  }

  close() {
    this.modalController.dismiss();
  }
}
