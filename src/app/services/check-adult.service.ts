import { Injectable } from '@angular/core';
import * as dateFns from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class CheckAdultService {
  constructor() {}

  checkIsAdult(userBirthdayString: string) {
    /*
    Pri tejto funkcii som nebral do úvahy časové pásmo krajiny v ktorej sa užívateľ narodil.
    Cudzokrajný užívateľ by napr. mohol mať dátum narodenia dnes, avšak v skutočnosti by nemusel
    naozaj prežiť celých 18 rokov (chýbalo by mu pár hodín kvôli časovému posunu jeho krajiny voči tejto).
    Predpokladám ale, že ide o údaj legálnej dospelosti, tak tam sa vraj časové pásmo do úvahy neberie.
    Prečítal som si to na internete :).
    */
    const userBirthday = this._parseSlovakDatestring(userBirthdayString);
    if (userBirthdayString == null || !this._checkIsValidDate(userBirthday)) {
      // if birthday is Invalid Date
      return false;
    }
    const dateToday = this._dateAtMidnight(new Date());
    if (dateFns.differenceInYears(dateToday, userBirthday) >= 18) {
      return true;
    }
    return false;
  }

  private _parseSlovakDatestring(dateString: string) {
    return dateFns.parse(dateString, 'd. M. y', new Date(0));
  }

  private _checkIsValidDate(date: Date) {
    return date instanceof Date && isFinite(date as unknown as number);
  }

  private _dateAtMidnight(date: Date) {
    // normalizing Date to have 00:00:00 time
    const dateString = dateFns.format(new Date(Date.now()), 'MM/dd/yyyy');
    return dateFns.parse(dateString, 'MM/dd/yyyy', new Date(0));
  }
}
