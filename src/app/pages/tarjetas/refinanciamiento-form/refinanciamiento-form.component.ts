import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  CreateTarjetaDTO,
  DiaPago,
  Interes,
  NumeroCuotas,
  TARJETA,
} from 'src/app/models/tarjeta.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TarjetasService } from 'src/app/shared/services/tarjetas.service';

@Component({
  selector: 'app-refinanciamiento-form',
  templateUrl: './refinanciamiento-form.component.html',
  styleUrls: ['./refinanciamiento-form.component.scss'],
})
export class RefinanciamientoFormComponent implements OnInit {
  tarjetaId!: string;
  tarjeta!: TARJETA;
  intereses = Object.keys(Interes).filter((key) => !isNaN(Number(key)));
  dia_de_pago = Object.keys(DiaPago);
  numero_cuotas = Object.keys(NumeroCuotas).filter(
    (key) => !isNaN(Number(key))
  );

  refinanciamientoForm = this.formBuilder.group({
    prestamo_sin_interes: new FormControl<number | null>(null, [
      Validators.required,
    ]),
    interes: new FormControl<Interes | null>(null, [Validators.required]),
    numero_cuotas: new FormControl<NumeroCuotas | null>(null, [
      Validators.required,
    ]),
    dia_de_pago: new FormControl<DiaPago | null>(null, [Validators.required]),
  });

  Interes = Interes;
  DiaPago = DiaPago;
  NumeroCuotas = NumeroCuotas;

  constructor(
    private tarjetasService: TarjetasService,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.tarjetasService.getTarjetaById(this.tarjetaId).subscribe((res) => {
      this.tarjeta = res;
    });
  }

  close() {
    this.modalController.dismiss();
  }

  refinanciarTarjeta() {
    const nuevaTarjeta: CreateTarjetaDTO = {
      clienteId: this.tarjeta.cliente.id,
      prestamo_sin_interes:
        this.refinanciamientoForm.controls.prestamo_sin_interes.value!,
      interes: this.refinanciamientoForm.controls.interes.value!,
      numero_cuotas: this.refinanciamientoForm.controls.numero_cuotas.value!,
      dia_de_pago: this.refinanciamientoForm.controls.dia_de_pago.value!,
    };
    this.tarjetasService.createTarjeta(nuevaTarjeta, true).subscribe((res) => {
      this.tarjetasService
        .createAbono({
          tarjetaId: this.tarjeta.id,
          cantidad_abonada: this.tarjeta.saldoPendiente,
        })
        .subscribe(() => {
          this.tarjetasService.singleTarjetaQuery.refetch();
          this.tarjetasService.tarjetasQuery.refetch();
          this.alertService.toast('Tarjeta Refinanciada');
          this.close();
        });
    });
  }
}
