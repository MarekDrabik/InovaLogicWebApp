import { Component, Input } from '@angular/core';
import { creation } from '../others/animations';

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss'],
  animations: [creation]
})
export class InputErrorComponent{

  @Input() errorText;
  @Input() displayError;

  constructor() { }

}
