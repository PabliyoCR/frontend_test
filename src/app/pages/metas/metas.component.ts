import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { USER } from 'src/app/models/usuario.model';
import { meses } from 'src/app/shared/pipes/fecha.pipe';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

import { DateTime } from 'luxon';

@Component({
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styleUrls: ['./metas.component.scss'],
})
export class MetasComponent implements OnInit {
  mes = meses[DateTime.now().month];
  usuarioActual!: USER;

  constructor(
    private usuarioServices: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.usuarioServices
      .getUsuarioById(this.authService.usuarioActualId)
      .subscribe((res) => {
        this.usuarioActual = res;
      });
  }
}
