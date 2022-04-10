import { Injectable } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { CheckAdultService } from './check-adult.service';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor(
    private checkAdultServ: CheckAdultService,
    private errorServ: ErrorsService,
  ) { }

  fullNameValidator = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const value = control.value;
    if (value == null) return null;
    if (typeof value !== 'string') this.errorServ.getError('fullNameError');
    const onlyEnglishAndSpacesRegex = /[a-zA-Z\s]*/;
    const match = onlyEnglishAndSpacesRegex.exec(value);
    if (Array.isArray(match) && match[0] === value) {
      return null;
    } else {
      return this.errorServ.getError('fullNameError');
    }
  };

  softRequiredValidator = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    if (control.dirty === false) return null;
    /*if control is not yet dirty, consider field to be valid. Submit button will still be disabled by other means.*/
    return Validators.required(control);
  };

  delayedEmailValidator = (
    control: AbstractControl
  ): Observable<{ [key: string]: any } | null> => {
    if (Validators.email(control) == null) return of(null);
    else {
      return of(1).pipe(
        delay(500), //give user some time to finish typing
        map((_) => Validators.email(control))
      );
    }
  };

  delayedTwoLetterNameValidator = (
    control: AbstractControl
  ): Observable<{ [key: string]: any } | null> => {
    if (control.dirty === false) return of(null); //if control is not yet dirty, consider field to be valid. Submit button will still be disabled by other means.
    if (this._hasTwoOrMoreWords(control.value)) return of(null);
    else {
      return of(1).pipe(
        delay(500), //give user some time to finish typing
        map((_) => this.twoLetterNameValidator(control))
      );
    }
  };

  twoLetterNameValidator = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    if (control.value === '') return null; //handled by required check
    if (this._hasTwoOrMoreWords(control.value)) return null;
    else return this.errorServ.getError('oneWordNameError');
  };

  isAdultValidatorFactory = (hasBeenAccessedCallback: () => boolean) => {
    return (
      control: AbstractControl
    ): { [key: string]: any } | null => {
      if (!hasBeenAccessedCallback() || control.value === '') return null; //control.value === '' on control reset
      if (this.checkAdultServ.checkIsAdult(control.value)) {
        return null;
      } else {
        return this.errorServ.getError('olderThan18Error');
      }
    };
  }

  private _hasTwoOrMoreWords = (s: string) => {
    return /[a-zA-Z]+\s+[a-zA-Z]+/.test(s);
  };
}
