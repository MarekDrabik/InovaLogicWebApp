import { Component, OnInit } from '@angular/core';
import * as dateFns from 'date-fns';
import { Subscription } from 'rxjs';
import { CountriesApiService } from '../services/countries-api.service';
import { FormSubmitionService } from '../services/form-submition.service';
import { UnsubscriptionService } from '../services/unsubscription.service';
import { SubmitValues, ApiCurrencyPayload } from '../others/types';

@Component({
  selector: 'app-form-summary',
  templateUrl: './form-summary.component.html',
  styleUrls: ['./form-summary.component.scss'],
})
export class FormSummaryComponent implements OnInit {
  private _sub: Subscription;
  summaryValues: { currency: string } & SubmitValues = null;
  currencyFetchError: boolean = false;

  constructor(
    private formSubmitionServ: FormSubmitionService,
    private countriesApiServ: CountriesApiService,
    private unsubServ: UnsubscriptionService
  ) {}

  ngOnInit() {
    this._observeSubmitionsToUpdateSummary();
  }

  private _observeSubmitionsToUpdateSummary() {
    this._sub = this.formSubmitionServ.formSubmit$.subscribe({
      next: (submitedValues) => this._updateSummary(submitedValues),
    });
  }

  private async _updateSummary(submitedValues: SubmitValues) {
    this.summaryValues = {
      ...submitedValues,
      date: this._fromSlovakToDashedDate(submitedValues.date),
      currency: '',
    };
    const currency = await this._getCurrency(submitedValues.country);
    if (submitedValues.country === this.summaryValues.country) {
      //just in case double check that the country didn't change while http call was being processed
      this.summaryValues.currency = currency;
    }
  }

  private _showCurrencyNotFetchedError = (country = '') => {
    this.currencyFetchError = true;
  };

  private async _getCurrency(country): Promise<string> {
    try {
      const currency = await this.countriesApiServ.getCountryCurrency(country);
      if (this._isValidCurrencyPayload(currency)) {
        this.currencyFetchError = false; //reset
        return currency[0].currencies.map((x) => x.code).join(', '); //vysledkom je string vsetkych mien krajiny
      } else {
        throw Error();
      }
    } catch {
      this._showCurrencyNotFetchedError();
      return '';
    }
  }

  private _isValidCurrencyPayload(payload: ApiCurrencyPayload | unknown) {
    return (
      Array.isArray(payload) &&
      payload.length > 0 &&
      payload[0].hasOwnProperty('currencies') &&
      Array.isArray(payload[0].currencies) &&
      payload[0].currencies.length > 0
    );
  }

  private _fromSlovakToDashedDate(slovakDateString: string) {
    const date = dateFns.parse(slovakDateString, 'd. M. y', new Date(0));
    return dateFns.format(date, 'd-M-yyyy');
  }

  ngOnDestroy() {
    this.unsubServ.unsubscribe(this._sub);
  }
}
