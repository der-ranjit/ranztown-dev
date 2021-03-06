import { AnimationEvent } from "@angular/animations";
import { Component, Input, Output } from "@angular/core";
import { Subject } from "rxjs";
import { NuiCB } from "../../../angular-fivem-shared/nui-events/callbacks";

import { slideIn } from "../_core/animations";
import { AppNuiEventsService } from "../_core/nui-events/nui-events.service";

@Component({
    selector: "nui-app-fly-high",
    template: `
        <div *ngIf="active" class="flyHigh" [@slideIn]="'left'" (@slideIn.done)="onCloseAnimationDone($event)" >
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
        }
    `],
    animations: [
        slideIn
    ]
})
export class FlyHighComponent {
    @Input()
    public active = false;

    @Output()
    public afterClose = new Subject();

    constructor(private events: AppNuiEventsService) {}

    public flyHigh() {
        this.events.emitNuiCallback(NuiCB.FlyHigh.FlyHigh, null);
    }

    public onCloseAnimationDone(event: AnimationEvent) {
        if (event.toState === "void") {
            this.afterClose.next();
        }
    }
}
