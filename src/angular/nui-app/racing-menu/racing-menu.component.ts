import { AnimationEvent } from "@angular/animations";
import { Component, Input, Output } from "@angular/core";
import { Subject } from "rxjs";
import { StartRace, StopRace } from "../../../angular-fivem-shared/nui-events/callbacks";
import { Race } from "../../../angular-fivem-shared/Racing";

import { slideIn } from "../_core/animations";
import { AppNuiEventsService } from "../_core/nui-events/nui-events.service";


@Component({
    selector: "nui-racing",
    template: `
        <div *ngIf="active" class="racing" [@slideIn]="'left'" (@slideIn.done)="onCloseAnimationDone($event)" >
            <ng-container *ngIf="!editModeActive">
                <button mat-raised-button color="primary" (click)="editModeActive = true">create track</button>
                <div *ngFor="let race of races">
                    <button mat-raised-button (click)="startRace(race)">start {{race.name}}</button>
                    <button mat-raised-button (click)="stopRace()">stop race</button>
                </div>
            </ng-container>
            <nui-track-editor *ngIf="editModeActive" (onTrackSaved)="races.push($event);editModeActive = false"></nui-track-editor>
        </div>
    `,
    styles: [`
        :host {
            display: flex;
            flex: 1;
            flex-direction: column;
            overflow: hidden;
        }
        .racing {
            display: flex;
            flex-direction: column;
            max-width: 300px;
            background-color: #424242;
            padding-bottom: 8px;
        }
    `],
    animations: [
        slideIn
    ]
})
export class RacingMenuComponent {
    @Input()
    public active = false;

    @Output()
    public afterClose = new Subject();

    public editModeActive = false;
    public races: Race[] = [];

    constructor(private events: AppNuiEventsService) {}

    public onCloseAnimationDone(event: AnimationEvent) {
        if (event.toState === "void") {
            this.afterClose.next();
        }
    }

    public async startRace(race: Race) {
        this.events.emitNuiCallback(StartRace, {race})
    }

    public async stopRace() {
        this.events.emitNuiCallback(StopRace, null);
    }
}
