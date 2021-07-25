import { Component } from "@angular/core";
import { FlyHigh } from 'src/shared/nui-events/callbacks';
import { AppNuiEventsService } from "../core/nui-events/nuiEvents.service";

@Component({
    selector: "nui-app-fly-high",
    template: `
        <div class="flyHigh">
            <button mat-raised-button color="accent" (click)="flyHigh()">Click to fly high</button>
        </div>
    `,
    styles: [`
        :host {
            display: flex;
            flex: 1;
            flex-direction: column;
            max-width: 300px;
            overflow: hidden;
        }
        .flyHigh {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            max-width: 300px;
            background-color: #424242;
            padding-bottom: 8px;

            button {
                margin: 8px;
            }
        }`]
})
export class FlyHighComponent {

    constructor(private events: AppNuiEventsService) {}

    public flyHigh() {
        this.events.emitNuiCallback(FlyHigh, null);
    }
}
