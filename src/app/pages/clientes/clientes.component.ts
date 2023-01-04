import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { CLIENTE, Zona } from 'src/app/models/cliente.model';
import { ClientesService } from 'src/app/shared/services/clientes.service';
import { TarjetasService } from 'src/app/shared/services/tarjetas.service';
import Swiper from 'swiper';
import { ClienteViewComponent } from './cliente-view/cliente-view.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

type tabInfo = { title: string; clientes: CLIENTE[] };

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  slides!: Swiper;

  slides_content: tabInfo[] = [
    { title: 'Clientes Activos', clientes: [] },
    { title: 'Clientes Inactivos', clientes: [] },
  ];

  tabIdx = 0;

  Zona = Zona;

  constructor(
    private clientesService: ClientesService,
    private tarjetasService: TarjetasService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.clientesService.getClientes().subscribe((result) => {
      this.slides_content[0].clientes = result.filter(
        (cliente) => cliente.tarjetas.length !== 0
      );
      this.slides_content[1].clientes = result.filter(
        (cliente) => cliente.tarjetas.length === 0
      );
    });
  }

  setSwiperInstance(swiper: any) {
    this.slides = swiper;
    this.tabIdx = this.slides.activeIndex;
  }

  changeTab(e: MatTabChangeEvent) {
    this.tabIdx = e.index;
    this.slides.slideTo(e.index);
  }

  onSlideChange() {
    this.tabIdx = this.slides.activeIndex;
    this.changeDetectorRef.detectChanges();
  }

  async openCliente(clienteId: string) {
    const modal = await this.modalController.create({
      component: ClienteViewComponent,
      componentProps: {
        clienteId,
      },
    });
    modal.present();
  }

  async openForm() {
    const modal = await this.modalController.create({
      component: ClienteFormComponent,
    });
    modal.present();
  }
}
