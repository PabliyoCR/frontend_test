import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CLIENTE } from 'src/app/models/cliente.model';
import {
  CreateTarjetaDTO,
  DiaPago,
  Interes,
  NumeroCuotas,
  UpdateTarjetaDTO,
} from 'src/app/models/tarjeta.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ClientesService } from 'src/app/shared/services/clientes.service';
import { TarjetasService } from 'src/app/shared/services/tarjetas.service';

@Component({
  selector: 'app-tarjeta-form',
  templateUrl: './tarjeta-form.component.html',
  styleUrls: ['./tarjeta-form.component.scss'],
})
export class TarjetaFormComponent implements OnInit {
  editando = false;
  tarjetaId!: string;

  clienteId!: string;
  intereses = Object.keys(Interes).filter((key) => !isNaN(Number(key)));
  dia_de_pago = Object.keys(DiaPago);
  numero_cuotas = Object.keys(NumeroCuotas).filter(
    (key) => !isNaN(Number(key))
  );

  Interes = Interes;
  DiaPago = DiaPago;
  NumeroCuotas = NumeroCuotas;

  tarjetaForm = this.formBuilder.group({
    prestamo_sin_interes: new FormControl<number | null>(null, [
      Validators.required,
    ]),
    interes: new FormControl<Interes | null>(null, [Validators.required]),
    numero_cuotas: new FormControl<NumeroCuotas | null>(null, [
      Validators.required,
    ]),
    dia_de_pago: new FormControl<DiaPago | null>(null, [Validators.required]),
  });

  valorCuotaControl = new FormControl<number | null>(null, Validators.required);

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private tarjetasService: TarjetasService,
    private clientesService: ClientesService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    if (this.editando) {
      this.tarjetasService.getTarjetaById(this.tarjetaId).subscribe((res) => {
        this.tarjetaForm.controls.prestamo_sin_interes.setValue(
          res.prestamo_sin_interes
        );
        this.tarjetaForm.controls.interes.setValue(res.interes);
        this.tarjetaForm.controls.numero_cuotas.setValue(res.numero_cuotas);
        this.tarjetaForm.controls.dia_de_pago.setValue(res.dia_de_pago);
        this.valorCuotaControl.setValue(res.valorCuota);
      });
    }
  }

  close() {
    this.modalController.dismiss();
  }

  registrarTarjeta() {
    const nuevaTarjeta: CreateTarjetaDTO = {
      clienteId: this.clienteId,
      prestamo_sin_interes:
        this.tarjetaForm.controls.prestamo_sin_interes.value!,
      interes: this.tarjetaForm.controls.interes.value!,
      numero_cuotas: this.tarjetaForm.controls.numero_cuotas.value!,
      dia_de_pago: this.tarjetaForm.controls.dia_de_pago.value!,
    };
    if (!this.editando) {
      this.tarjetasService
        .createTarjeta(nuevaTarjeta, false)
        .subscribe((res) => {
          this.clientesService.clientesQuery.refetch();
          this.alertService.toast('Tarjeta Agregada');
          this.close();
        });
    } else {
      const actualizandoTarjeta: UpdateTarjetaDTO = {
        id: this.tarjetaId,
        valorCuota: this.valorCuotaControl.value!,
        ...nuevaTarjeta,
      };
      this.tarjetasService
        .actualizarTarjeta(actualizandoTarjeta)
        .subscribe((res) => {
          this.tarjetasService.singleTarjetaQuery.refetch();
          this.alertService.toast('Tarjeta Actualizada');
          this.close();
        });
    }
  }
}
