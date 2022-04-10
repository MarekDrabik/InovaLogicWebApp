import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  private _errors: { [s in string]: string } = {
    fullNameError:
      'Meno a Priezvisko môže obsahovať len znaky anglickej abecedy a medzery.',
    oneWordNameError: 'Pole musí obsahovať aspoň 2 slová.',
    olderThan18Error: 'Musíte mať viac ako 18 rokov.',
    required: 'Pole je povinné.',
    email: 'Nesprávny tvar emailu.',
  };

  constructor() {}

  getError(
    errorName: 'fullNameError' | 'oneWordNameError' | 'olderThan18Error'
  ) {
    return {
      [errorName]: this._errors[errorName],
    };
  }

  getErrorMessage(errorName: 'required' | 'email') {
    return this._errors[errorName];
  }

  extractControlErrorMessage(control: FormControl) {
    if (control.errors == null) return; //no errors
    if (
      control.errors.hasOwnProperty('required') &&
      control.errors.required === true
    ) {
      return this.getErrorMessage('required');
    }
    if (
      control.errors.hasOwnProperty('email') &&
      control.errors.email === true
    ) {
      return this.getErrorMessage('email');
    }
    for (let error of [
      'fullNameError',
      'oneWordNameError',
      'olderThan18Error',
    ]) {
      if (control.errors.hasOwnProperty(error)) return control.errors[error];
    }
  }
}
