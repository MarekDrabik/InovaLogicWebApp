import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { SubmitValues } from './tab2/tab2.page';

@Injectable({
  providedIn: 'root'
})
export class FormSubmitionService {

  formSubmit$ = new Subject<SubmitValues>();

  submitForm (formGroup: FormGroup) {
    const values = {}

    for (let field in formGroup.controls) {
      values[field] = formGroup.controls[field].value;
    }
    this.formSubmit$.next(values as SubmitValues);
  }


  constructor() { }

}
