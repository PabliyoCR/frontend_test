import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LogInDTO } from '../auth.model';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-logIn',
  templateUrl: './logIn.component.html',
  styleUrls: ['./logIn.component.scss'],
})
export class LogInComponent implements OnInit {
  logInForm = this.formBuilder.group({
    email: new FormControl({ value: '', disabled: false }, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {}

  async logIn() {
    const loading = await this.loadingController.create();
    await loading.present();

    if (!this.isFormValid()) return;
    this.authService
      .logIn(this.logInForm.value as LogInDTO)
      .subscribe(async (res) => {
        await loading.dismiss();
        if (res.errors) {
          this.showAlert(
            'Hubo un Error',
            JSON.stringify(res.errors.map((err) => err.message))
          );
          return;
        }
        this.authService.registerToken(res.data.result.access_token);
        this.router.navigate(['/']);
      });
  }

  // TODO: Make this generic
  isFormValid(): boolean {
    if (this.logInForm.invalid) {
      this.logInForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
