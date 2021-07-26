import { animate, style, transition, trigger } from "@angular/animations";

export const defaultAnimationTimeMS = 150;

export const fade = trigger('fade', [
    transition('void => *', [
        style({ opacity: 0 }),
        animate(defaultAnimationTimeMS, style({ opacity: 1 }))
    ]),
    transition('* => void', [
        animate(defaultAnimationTimeMS, style({ opacity: 0 }))
    ])
])

export const slideIn = trigger('slideIn', [
    transition('void => top', [
        style({ transform: 'translateY(-100%)' }),
        animate(defaultAnimationTimeMS, style({ transform: 'translateY(0)' }))
    ]),
    transition('top => void', [
        animate(defaultAnimationTimeMS, style({ transform: 'translateY(-100%)' }))
    ]),
    transition('void => right', [
        style({ transform: 'translateX(100%)' }),
        animate(defaultAnimationTimeMS, style({ transform: 'translateX(0)' }))
    ]),
    transition('right => void', [
        animate(defaultAnimationTimeMS, style({ transform: 'translateX(100%)' }))
    ]),
    transition('void => left', [
        style({ transform: 'translateX(-100%)' }),
        animate(defaultAnimationTimeMS, style({ transform: 'translateX(0)' }))
    ]),
    transition('left => void', [
        animate(defaultAnimationTimeMS, style({ transform: 'translateX(-100%)' }))
    ]),
    transition('void => bottom', [
        style({ transform: 'translateY(100%)' }),
        animate(defaultAnimationTimeMS, style({ transform: 'translateY(0)' }))
    ]),
    transition('bottom => void', [
        animate(defaultAnimationTimeMS, style({ transform: 'translateY(100%)' }))
    ]),
])
