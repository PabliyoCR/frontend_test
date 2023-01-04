import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ConceptoGasto, Gasto, USER } from 'src/app/models/usuario.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.scss'],
})
export class GastosComponent implements OnInit {
  conceptos = Object.keys(ConceptoGasto);
  ConceptoGasto = ConceptoGasto;
  usuarioActual!: USER;

  gastoForm = this.formBuilder.group({
    concepto: new FormControl<ConceptoGasto | null>(null, [
      Validators.required,
    ]),
    monto: new FormControl<number | null>(null, [Validators.required]),
    descripcion: new FormControl<string>(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioServices: UsuarioService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.usuarioServices
      .getUsuarioById(this.authService.usuarioActualId)
      .subscribe((res) => {
        this.usuarioActual = res;
      });
  }

  crearGasto() {
    const nuevoGasto = this.gastoForm.value as Gasto;
    let gastos = this.usuarioActual.gastos.slice();
    gastos.push(nuevoGasto);
    this.updateGastos(gastos);
  }

  eliminarGasto(idx: number) {
    const alertPromise = this.alertService.continueAlert(
      'Deseas eliminar el gasto',
      'Eliminar',
      'alert-button-confirm-danger'
    );
    alertPromise.then(async (alert) => {
      await alert.present();
      const { role } = await alert.onDidDismiss();
      if (role === 'confirm') {
        let gastos = this.usuarioActual.gastos.slice();
        gastos.splice(idx, 1);
        this.updateGastos(gastos);
      }
    });
  }

  updateGastos(gastos: Gasto[]) {
    this.usuarioServices
      .actualizarGastos(this.usuarioActual.id, gastos)
      .subscribe((res) => {
        this.usuarioServices.singleUserQuery.refetch();
        this.gastoForm.reset();
        this.gastoForm.controls.descripcion.setValue('');
        this.alertService.toast('Gastos Actualizados');
      });
  }
}
