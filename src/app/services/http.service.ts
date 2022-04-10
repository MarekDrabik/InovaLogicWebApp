import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCountriesPayload, ApiCurrencyPayload } from '../others/types';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private restcountriesUrl = 'https://restcountries.com/v2';
  private allCountriesUrl = this.restcountriesUrl + '/all';

  constructor(private httpClient: HttpClient) {}

  fetchAllCountriesNames() {
    //https://restcountries.com/v2/all?fields=name
    return this.httpClient.get(this.allCountriesUrl, {
      params: {
        fields: 'name',
      },
    }) as Observable<ApiCountriesPayload>;
  }

  fetchCountryCurrencies(country: string) {
    //https://restcountries.com/v2/name/peru?fields=currencies
    return this.httpClient.get(this._buildCountryUrl(country), {
      params: {
        fields: 'currencies',
      },
    }) as Observable<ApiCurrencyPayload>;
  }

  private _buildCountryUrl(country: string) {
    return this.restcountriesUrl + '/name/' + country;
  }
}
