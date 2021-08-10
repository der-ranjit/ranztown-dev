import { Directive, ElementRef, HostListener } from "@angular/core";

import { NuiCB } from "../../../angular-fivem-shared/nui-events/callbacks";
import { AppNuiEventsService } from "./nui-events/nui-events.service";

@Directive({
    selector:"[exclusiveInput]"
})
export class ExclusiveInputDirective {
    constructor(
        private events: AppNuiEventsService,
        private elementRef: ElementRef<HTMLElement>) {
    }

    @HostListener("blur")
    public enableAllControls(): void {
        this.events.emitNuiCallback(NuiCB.Main.SetControlsDisabled, {disabled: false});
    }

    @HostListener("focus")
    public disableAllControls(): void {
        this.events.emitNuiCallback(NuiCB.Main.SetControlsDisabled, {disabled: true});
    }

    @HostListener("keyup.escape")
    public blur() {
        this.elementRef.nativeElement.blur();
    }
}
