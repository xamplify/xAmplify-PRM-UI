import {
    trigger,
    style,
    transition,
    animate,
} from "@angular/animations";

let translateAxis = "translateY";
export const CustomAnimation = [
    
    trigger("fadeInOut", [
        transition(":enter", [
            // :enter is alias to 'void => *'
            style({ transform: translateAxis+"(100%)", opacity: 0 }),
            animate("500ms", style({ transform: translateAxis+"(0)", opacity: 1 })),
        ]),
        transition(":leave", [
            // :leave is alias to '* => void'
            style({ transform: translateAxis+"(0)", opacity: 1 }),
            animate("500ms", style({ transform: translateAxis+"(100%)", opacity: 0 })),
        ]),
    ]),
];
