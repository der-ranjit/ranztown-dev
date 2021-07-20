import { Directive, HostListener } from "@angular/core";
import { Callback } from "../../shared/nui-events";
import { AppNuiEventsService } from "./nui-events/nuiEvents.service";

@Directive({
    selector:"[exclusiveInput]"
})
export class ExclusiveInputDirective {
    constructor(private events: AppNuiEventsService) {
    }

    @HostListener("blur")
    public enableAllControls(): void {
        this.events.emitNuiCallback(Callback.SetControlsDisabled, {disabled: false});
    }

    @HostListener("focus")
    public disableAllControls(): void {
        this.events.emitNuiCallback(Callback.SetControlsDisabled, {disabled: true});
    }
}
