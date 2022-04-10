import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CalendarComponent } from '../calendar/calendar.component';
import { InputErrorComponent } from '../input-error/input-error.component';
import { IonselectAutoscrollDirective } from '../others/ionselect-autoscroll.directive';
import { UserFormComponent } from '../user-form/user-form.component';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { Tab1Page } from './tab1.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    Tab1Page,
    UserFormComponent,
    IonselectAutoscrollDirective,
    InputErrorComponent,
    CalendarComponent,
  ],
})
export class Tab1PageModule {}
