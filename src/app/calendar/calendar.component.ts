import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonPopover } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

  currentDateValue : string = ''; //this keeps track of currently set birthday for ionDatetime popover load value
  @ViewChild('popover', {read: IonPopover}) popover: IonPopover;
  @Output() dateChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  presentPopover() {
    this.popover.present()
  }

  getYearNow() {
    new Date(Date.now()).getFullYear();
  }

  onUserDateInput(value: string, popover: IonPopover) {
    this._updateDateField(value);
    this.popover.dismiss();
  }

  resetValue() {
    this.currentDateValue = '';
  }

  private _updateDateField(value: string) {
    this.currentDateValue = value;
    const slovakDate =
      value == null
        ? null
        : new Date(value).toLocaleString('sk-SK').split(',')[0];
    this.dateChange.emit(slovakDate)
  }
}
