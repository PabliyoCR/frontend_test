import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  CLIENTE,
  CreateClienteDTO,
  UpdateClientesDTO,
  Zona,
} from 'src/app/models/cliente.model';
import { ClientesService } from 'src/app/shared/services/clientes.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
})
export class ClienteFormComponent implements OnInit {
  editando = false;
  clienteId!: string;

  zonas = Object.keys(Zona);
  contacto: number[] = [];
  numeroContacto = new FormControl<number | null>(null, [Validators.required]);

  clienteForm = this.formBuilder.group({
    nombre: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    c_c: new FormControl({ value: '', disabled: false }, [Validators.required]),
    zona: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
  });

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
    private formBuilder: FormBuilder,
    private clientesService: ClientesService,
    private geolocation: Geolocation,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    if (!this.editando) {
      this.geolocation.getCurrentPosition().then((res) => {
        this.center = { lat: res.coords.latitude, lng: res.coords.longitude };
      });
    } else {
      this.clientesService.getClienteById(this.clienteId).subscribe((res) => {
        this.clienteForm.controls.nombre.setValue(res.nombre);
        this.clienteForm.controls.c_c.setValue(res.c_c);
        this.clienteForm.controls.zona.setValue(res.zona);
        this.contacto = res.contacto.slice();
        this.center = {
          lat: res.direccion.latitud,
          lng: res.direccion.longitud,
        };
      });
    }
  }

  agregarNumero() {
    this.contacto.push(this.numeroContacto.value!);
    this.numeroContacto.reset();
  }

  removerNumero(idx: number) {
    this.contacto.splice(idx, 1);
  }

  moveMapMark(e: google.maps.MapMouseEvent) {
    if (e.latLng) {
      this.center = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    }
  }

  close() {
    this.modalController.dismiss();
  }

  registrarCliente() {
    const nuevoCliente: CreateClienteDTO = {
      nombre: this.clienteForm.controls.nombre.value!,
      c_c: this.clienteForm.controls.c_c.value!,
      zona: this.clienteForm.controls.zona.value!,
      contacto: this.contacto,
      direccion: { latitud: this.center.lat, longitud: this.center.lng },
    };
    if (!this.editando) {
      this.clientesService.createCliente(nuevoCliente).subscribe((res) => {
        this.clientesService.clientesQuery.refetch();
        this.alertService.toast('Cliente Agregado');
        this.close();
      });
    } else {
      const actualizandoCliente: UpdateClientesDTO = {
        id: this.clienteId,
        ...nuevoCliente,
      };
      this.clientesService
        .actualizarCliente(actualizandoCliente)
        .subscribe((res) => {
          this.clientesService.clientesQuery.refetch();
          this.alertService.toast('Cliente Actualizado');
          this.close();
        });
    }
  }
}
