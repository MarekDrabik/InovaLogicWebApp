import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const creation = trigger('creation', [
  state(
    'in',
    style({
      opacity: 0.6,
      top: '0rem',
    })
  ),
  transition(':enter', [
    style({
      opacity: 0,
      top: '2rem',
    }),
    animate(200),
  ]),
  transition(':leave', [
    animate(
      200,
      style({
        opacity: 0,
        top: '2rem',
      })
    ),
  ]),
]);
