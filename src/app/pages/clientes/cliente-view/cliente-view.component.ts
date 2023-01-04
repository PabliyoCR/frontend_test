import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CLIENTE, Zona } from 'src/app/models/cliente.model';
import { TarjetaFormComponent } from '../../tarjetas/tarjeta-form/tarjeta-form.component';
import { TarjetaViewComponent } from '../../tarjetas/tarjeta-view/tarjeta-view.component';
import { ClientesService } from 'src/app/shared/services/clientes.service';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';

@Component({
  selector: '[app-cliente-view]',
  templateUrl: './cliente-view.component.html',
  styleUrls: ['./cliente-view.component.scss'],
})
export class ClienteViewComponent implements OnInit {
  clienteId!: string;
  cliente!: CLIENTE;

  Zona = Zona;

  center!: google.maps.LatLngLiteral;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  constructor(
    private modalController: ModalController,
    private clientesService: ClientesService
  ) {}

  ngOnInit() {
    this.clientesService.getClienteById(this.clienteId).subscribe((res) => {
      this.cliente = res;
      this.center = {
        lat: this.cliente.direccion.latitud,
        lng: this.cliente.direccion.longitud,
      };
    });
  }

  close() {
    this.modalController.dismiss();
  }

  async crearTarjeta() {
    const modal = await this.modalController.create({
      component: TarjetaFormComponent,
      componentProps: {
        clienteId: this.cliente.id,
      },
    });
    modal.present();
    this.close();
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

  async editarCliente() {
    const modal = await this.modalController.create({
      component: ClienteFormComponent,
      componentProps: {
        clienteId: this.cliente.id,
        editando: true,
      },
    });
    modal.present();
  }

  call(e: Event, numero: number) {
    e.stopPropagation();
    document.location.href = `tel:${numero}`;
  }
}
