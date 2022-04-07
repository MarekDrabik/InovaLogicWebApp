import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class InputValidationService {
  constructor() {}

  fullNameValidator = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const value = control.value;
    if (typeof value !== 'string') return {};
    const onlyEnglishAndSpacesRegex = /[a-zA-Z\s]+/;
    const match = onlyEnglishAndSpacesRegex.exec(value);
    if (Array.isArray(match) && match[0] === value) {
      return null;
    } else {
      return {
        fullNameError:
          'Meno a Priezvisko môže obsahovať len znaky anglickej abecedy a medzery',
      };
    }
  };
}
