import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CountriesApiService {
  constructor(private httpServ: HttpService) {}

  async getCountries() {
    return await this.httpServ
      .fetchAllCountriesNames()
      .pipe(map((countries) => countries.map((c) => c.name)))
      .toPromise();
  }

  async getCountryCurrency(country: string) {
    return await this.httpServ
      .fetchCountryCurrencies(country)
      .toPromise()
  }
}
