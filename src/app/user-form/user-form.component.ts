import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormSubmitionService } from '../form-submition.service';
import { InputValidationService } from '../input-validation.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  countries = ['Uganda', 'Czechia', 'Albania'];
  private _subs: Subscription[] = [];

  constructor(
    private inputValidationServ: InputValidationService,
    private formSubmitionServ: FormSubmitionService
  ) {}

  controls: {
    [s: string]: FormControl;
  } = {
    fullName: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        this.inputValidationServ.fullNameValidator,
      ])
    ),
    email: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.email])
    ),
    date: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
  };
  formGroup: FormGroup = new FormGroup(this.controls);

  ngOnInit() {
    this._subs.push(
      this.formGroup.valueChanges.subscribe({
        next: (ev) => {
          console.log(ev, this.formGroup);
        },
      })
    );
  }

  getYearNow() {
    new Date(Date.now()).getFullYear();
  }

  extractError(control: FormControl) {
    if (!control) return;
    if (
      control.errors.hasOwnProperty('required') &&
      control.errors.required === true
    ) {
      return 'Pole musí byť vyplnené.';
    }
    if (
      control.errors.hasOwnProperty('email') &&
      control.errors.email === true
    ) {
      return 'Nesprávny tvar emailu.';
    }
    if (control.errors.hasOwnProperty('fullNameError')) {
      return control.errors.fullNameError;
    }
  }

  updateDateField(value: string) {
    console.log('value', value);
    const slovakDate =
      value == null
        ? null
        : new Date(value).toLocaleString('sk-SK').split(',')[0];
    this.controls.date.setValue(slovakDate, { emitEvent: true });
  }

  submitForm() {
    this.formSubmitionServ.submitForm(this.formGroup);
  }

  ngOnDestroy() {
    this._subs.forEach((s) => s.unsubscribe());
  }
}
