import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { SubmitValues } from '../others/types';

@Injectable({
  providedIn: 'root',
})
export class FormSubmitionService {
  formSubmit$ = new ReplaySubject<SubmitValues>(1);

  constructor() {}

  submitForm(formGroup: FormGroup) {
    const values = {};

    for (let field in formGroup.controls) {
      values[field] = formGroup.controls[field].value;
    }
    this.formSubmit$.next(values as SubmitValues);
  }
}
