import { Directive, ElementRef, HostListener } from "@angular/core";
import { Callback } from "../../shared/nui-events";
import { AppNuiEventsService } from "./nui-events/nuiEvents.service";

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
        this.events.emitNuiCallback(Callback.SetControlsDisabled, {disabled: false});
    }

    @HostListener("focus")
    public disableAllControls(): void {
        this.events.emitNuiCallback(Callback.SetControlsDisabled, {disabled: true});
    }

    @HostListener("keyup.escape")
    public blur() {
        this.elementRef.nativeElement.blur();
    }
}
