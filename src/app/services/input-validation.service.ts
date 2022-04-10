import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserFormControls } from '../others/types';
import { UnsubscriptionService } from './unsubscription.service';
import { ValidatorsService } from './validators.service';

@Injectable({
  providedIn: 'root',
})
export class InputValidationService {
  private _sub: Subscription;
  private _controlsAccessed: { [s in keyof UserFormControls]: boolean } = {
    fullName: false,
    email: false,
    country: false,
    date: false,
  };

  constructor(
    private unsubServ: UnsubscriptionService,
    private validatorsServ: ValidatorsService
  ) {}

  updateControlsAccessed(values: { [s in keyof UserFormControls]: string }) {
    for (let control in values) {
      if (values[control] != '') this._controlsAccessed[control] = true;
    }
  }

  checkControlAccessed(control: keyof UserFormControls) {
    return this._controlsAccessed[control];
  }
  checkAllControlsAccessed() {
    let allAccessed = true;
    for (let control in this._controlsAccessed) {
      if (this._controlsAccessed[control] === false) allAccessed = false;
    }
    return allAccessed;
  }
  resetControlsAccessed() {
    for (let control in this._controlsAccessed) {
      this._controlsAccessed[control] = false;
    }
  }

  getControlValidators(control: keyof UserFormControls) {
    /* some of these validators are asynchronous that I implemented for nicer UI/UX. They are not reliable for synchronous form validity checks.
    See function checkFormValiditySynchronously that fixes it. */
    switch (control) {
      case 'fullName':
        return [
          Validators.compose([
            this.validatorsServ.softRequiredValidator,
            this.validatorsServ.fullNameValidator,
          ]),
          this.validatorsServ.delayedTwoLetterNameValidator,
        ];
        break;
      case 'email':
        return [
          this.validatorsServ.softRequiredValidator,
          this.validatorsServ.delayedEmailValidator,
        ];
        break;
      case 'date':
        return [
          Validators.compose([
            this.validatorsServ.softRequiredValidator,
            this.validatorsServ.isAdultValidatorFactory(() =>
              this.checkControlAccessed('date')
            ),
          ]),
        ];
        break;
      case 'country':
        return [this.validatorsServ.softRequiredValidator];
      default:
        break;
    }
  }

  checkFormValiditySynchronously(formGroup: FormGroup) {
    /* This is an addition validity check performed for submit button disabling.
    I implemeted some async validators (soft..., delayed...) that I implemented for nicer UI/UX.
    They can cause formGroup to be falsly valid for short periods of time which is fixed by this additional checks.
    */
    let allFieldsAccessed = this.checkAllControlsAccessed();

    const fieldsSyncValid =
      this.validatorsServ.fullNameValidator(formGroup.controls['fullName']) ===
        null &&
      this.validatorsServ.twoLetterNameValidator(
        formGroup.controls['fullName']
      ) === null &&
      Validators.email(formGroup.controls['email']) === null;

    return (
      allFieldsAccessed && // because when field is not yet accessed by user, required requirement is ignored by my custom async validators
      fieldsSyncValid && // to avoid short periods of time of false validity
      formGroup.valid === true
    ); // async validators must also agree that the form is valid. When form is valid async validators return without delay.
  }

  ngOnDestroy() {
    this.unsubServ.unsubscribe(this._sub);
  }
}
