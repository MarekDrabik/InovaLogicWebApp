import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarComponent } from '../calendar/calendar.component';
import { CountriesApiService } from '../services/countries-api.service';
import { ErrorsService } from '../services/errors.service';
import { FormSubmitionService } from '../services/form-submition.service';
import { InputValidationService } from '../services/input-validation.service';
import { UnsubscriptionService } from '../services/unsubscription.service';
import { UserFormControls } from '../others/types';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  countries: string[];
  showCountriesNotFetchedError = false;
  submitEnabled = false;
  controlsNames: (keyof UserFormControls)[] = [
    'fullName',
    'email',
    'date',
    'country',
  ];
  controls: UserFormControls = null;
  formGroup: FormGroup = null;

  private _subs: Subscription[] = [];

  @ViewChild('calendar', { read: CalendarComponent })
  calendarComponent: CalendarComponent;

  constructor(
    public inputValidationServ: InputValidationService,
    private formSubmitionServ: FormSubmitionService,
    private router: Router,
    private countriesApiServ: CountriesApiService,
    public errorsServ: ErrorsService,
    private unsubServ: UnsubscriptionService
  ) {
    this.controls = this._buildControls();
    this.formGroup = new FormGroup(this.controls);
  }

  ngOnInit() {
    this._loadCountries();
    this._observeUserInputToSyncValidateForm();
  }

  onUserDateInput(slovakDate: string) {
    this.controls.date.setValue(slovakDate, { emitEvent: true });
    this.controls.date.updateValueAndValidity();
    /*this is important call, because validator needs run after user input
    because validator is using checkControlAccessed function which needs current user input*/
  }

  onSubmit() {
    this.formSubmitionServ.submitForm(this.formGroup);
    this.router.navigate(['/tabs/tab2']);
  }

  onResetClick() {
    for (let control in this.controls) {
      this.controls[control].reset('', { onlyself: false });
    }
    this.inputValidationServ.resetControlsAccessed(); //must go behind this.controls[control].reset('') call
    this.calendarComponent.resetValue();
    this.submitEnabled = false;
  }

  private _buildControls() {
    const controls = {} as unknown as UserFormControls;
    this.controlsNames.forEach(
      (name) =>
        (controls[name] = new FormControl(
          '',
          ...this.inputValidationServ.getControlValidators(name)
        ))
    );
    return controls;
  }

  private _observeUserInputToSyncValidateForm() {
    this._subs.push(
      this.formGroup.valueChanges.subscribe({
        next: (values) => {
          this.inputValidationServ.updateControlsAccessed(values);
          this.submitEnabled =
            this.inputValidationServ.checkFormValiditySynchronously(
              this.formGroup
            );
        },
      })
    );
  }

  private async _loadCountries() {
    try {
      this.countries = await this.countriesApiServ.getCountries();
    } catch {
      this.showCountriesNotFetchedError = true;
    }
  }

  ngOnDestroy() {
    this.unsubServ.unsubscribeFromArray(this._subs);
  }
}
