import {
    trigger,
    state,
    style,
    animate,
    transition } from '@angular/animations';

export const FadeAnimation = [
    
  trigger('slowAnimate', [
    transition(':enter', [style({opacity: '0'}), animate(500)]),
    transition(':leave', [style({opacity: '1'}), animate(500, style({opacity: '0'}))]),
  ])
];
