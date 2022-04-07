import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormSubmitionService } from '../form-submition.service';

export type SubmitValues = {
  fullName: string,
  email: string,
  date: string,
  country: string,
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  private _sub : Subscription;
  values: SubmitValues = {
    fullName: '',
    email: '',
    date: '',
    country: '',
  }

  constructor(private formSubmitionServ: FormSubmitionService) {
    this._sub = this.formSubmitionServ.formSubmit$.subscribe({
      next: values => this.values = values
    })
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

}
