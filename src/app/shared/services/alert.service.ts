import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async errorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  continueAlert(
    message: string,
    confirmWord: string,
    confirmClass: string
  ): Promise<HTMLIonAlertElement> {
    return this.alertController.create({
      header: 'Alerta',
      message,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'me-4',
        },
        {
          text: confirmWord,
          role: 'confirm',
          cssClass: '' + confirmClass,
        },
      ],
    });
  }

  async toast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      icon: 'checkmark',
    });

    await toast.present();
  }
}
