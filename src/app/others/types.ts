import { FormControl } from '@angular/forms';

export type SubmitValues = {
  [s in keyof UserFormControls]: string;
};

export type UserFormControls = {
  fullName: FormControl;
  email: FormControl;
  date: FormControl;
  country: FormControl;
};

export type ApiCountriesPayload = {
  name: string;
}[];

export type ApiCurrencyPayload = {
  currencies: { code: string }[];
}[];
