import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, IonModal, ModalController } from '@ionic/angular';
import {
  DiaPago,
  Interes,
  NumeroCuotas,
  TARJETA,
} from 'src/app/models/tarjeta.model';
import { TarjetasService } from 'src/app/shared/services/tarjetas.service';
import { Zona } from 'src/app/models/cliente.model';
import { FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ClienteViewComponent } from '../../clientes/cliente-view/cliente-view.component';
import { RefinanciamientoFormComponent } from '../refinanciamiento-form/refinanciamiento-form.component';
import { TarjetaFormComponent } from '../tarjeta-form/tarjeta-form.component';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjeta-view.component.html',
  styleUrls: ['./tarjeta-view.component.scss'],
})
export class TarjetaViewComponent implements OnInit {
  @ViewChild(IonModal) modalView!: IonModal;

  contarInput = new FormControl<number | null>(null, [Validators.required]);
  descontarInput = new FormControl<number | null>(null, [Validators.required]);

  tarjetaId!: string;
  tarjeta!: TARJETA;

  DiaPago = DiaPago;
  NumeroCuotas = NumeroCuotas;
  Interes = Interes;
  Zona = Zona;

  constructor(
    private modalController: ModalController,
    private tarjetasService: TarjetasService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.tarjetasService.getTarjetaById(this.tarjetaId).subscribe((res) => {
      this.tarjeta = res;
    });
  }

  cerrarModalView() {
    this.modalView.dismiss();
  }

  close() {
    this.modalController.dismiss();
  }

  addAbono(contar: boolean) {
    let cantidad_abonada: number;
    if (contar) {
      cantidad_abonada = this.contarInput.value!;
    } else {
      cantidad_abonada = this.descontarInput.value!;
    }
    if (!cantidad_abonada || cantidad_abonada <= 0) {
      this.alertService.errorAlert('Por favor ingresa un valor válido');
      return;
    }
    cantidad_abonada = contar ? cantidad_abonada : cantidad_abonada * -1;
    const alertPromise = this.alertService.continueAlert(
      contar ? 'Deseas ABONAR a la Tarjeta' : 'Deseas DESCONTAR a la Tarjeta',
      contar ? 'ABONAR' : 'DESCONTAR',
      contar ? 'alert-button-confirm-ok' : 'alert-button-confirm-danger'
    );
    alertPromise.then(async (alert) => {
      await alert.present();
      const { role } = await alert.onDidDismiss();
      if (role === 'confirm') {
        this.tarjetasService
          .createAbono({
            tarjetaId: this.tarjetaId,
            cantidad_abonada,
          })
          .subscribe((res) => {
            this.tarjetasService.singleTarjetaQuery.refetch();
            this.contarInput.reset();
            this.descontarInput.reset();
          });
      }
    });
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

  call(numero: number) {
    document.location.href = `tel:${numero}`;
  }

  async refinanciar() {
    const modal = await this.modalController.create({
      component: RefinanciamientoFormComponent,
      componentProps: {
        tarjetaId: this.tarjeta.id,
      },
    });
    modal.present();
  }

  async editar() {
    const modal = await this.modalController.create({
      component: TarjetaFormComponent,
      componentProps: {
        editando: true,
        tarjetaId: this.tarjeta.id,
      },
    });
    modal.present();
  }
}
