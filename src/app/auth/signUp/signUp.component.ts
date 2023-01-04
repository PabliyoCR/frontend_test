import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { SignUpDTO } from '../auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signUp',
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.scss'],
})
export class SignUpComponent implements OnInit {
  // TODO: Setup autocomplete
  signUpForm = this.formBuilder.group({
    email: new FormControl(
      {
        value: '',
        disabled: false,
      },
      [Validators.required, Validators.email]
    ),
    password: new FormControl({ value: '', disabled: false }, [
      Validators.required,
      Validators.minLength(8),
    ]),
    passwordConfirmation: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    firstName: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    lastName: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm.addValidators(
      this.createCompareValidator(
        this.signUpForm.controls.password,
        this.signUpForm.controls.passwordConfirmation
      )
    );
  }

  ngOnInit(): void {}

  SignUp() {
    if (!this.isFormValid()) return;
    this.authService
      .signUp(this.signUpForm.value as SignUpDTO)
      .subscribe((res) => {
        if (res.errors) return;
        this.router.navigate(['/logIn']);
        // TODO: Alert user created
        // TODO: email verifications
      });
  }

  createCompareValidator(
    passControl: AbstractControl,
    passConfirmControl: AbstractControl
  ) {
    return () => {
      if (passControl.value !== passConfirmControl.value)
        return { match_error: 'Value does not match' };
      return null;
    };
  }

  isFormValid(): boolean {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return false;
    }
    return true;
  }
}
