import { AnimationEvent } from "@angular/animations";
import { Component, Input, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { GetRaceTracks, LoadTrackIDForAllPlayers, StartRace, StopRace } from "../../../angular-fivem-shared/nui-events/callbacks";
import { RaceTracksUpdated } from "../../../angular-fivem-shared/nui-events/messages";
import { Race } from "../../../angular-fivem-shared/Racing";

import { slideIn } from "../_core/animations";
import { NuiMessageEvents, NuiMessageListener } from "../_core/nui-events/decorators";
import { AppNuiEventsService } from "../_core/nui-events/nui-events.service";


@Component({
    selector: "nui-racing",
    template: `
        <div *ngIf="active" class="racing" [@slideIn]="'left'" (@slideIn.done)="onCloseAnimationDone($event)" >
            <ng-container *ngIf="!editModeActive">
                <button mat-raised-button color="primary" (click)="editModeActive = true">create track</button>
                <div *ngFor="let race of (raceTracks$ | async)">
                    <button mat-raised-button (click)="startRace(race)">start {{race.name}}</button>
                    <button mat-raised-button (click)="startRaceForAll(race.id)">start4all {{race.name}}</button>
                    <button mat-raised-button (click)="stopRace()">stop race</button>
                </div>
            </ng-container>
            <nui-track-editor *ngIf="editModeActive" (onTrackSaved)="editModeActive = false"></nui-track-editor>
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
@NuiMessageEvents
export class RacingMenuComponent implements OnInit {
    @Input()
    public active = false;

    @Output()
    public afterClose = new Subject();

    public editModeActive = false;
    public raceTracks$ = new BehaviorSubject<Race[]>([]);

    constructor(private events: AppNuiEventsService) {}

    public onCloseAnimationDone(event: AnimationEvent) {
        if (event.toState === "void") {
            this.afterClose.next();
        }
    }

    public ngOnInit() {
        this.requestUpdateRaceTracks()
    }

    @NuiMessageListener(RaceTracksUpdated)
    private onRaceTracksUpdate(event: RaceTracksUpdated) {
        setTimeout(() => this.raceTracks$.next(event.data.raceTracks), 0)
    }

    private requestUpdateRaceTracks() {
        this.events.emitNuiCallback(GetRaceTracks, null);
    }

    public async startRace(race: Race) {
        this.events.emitNuiCallback(StartRace, {race})
    }

    public async startRaceForAll(id: string) {
        this.events.emitNuiCallback(LoadTrackIDForAllPlayers, {id})
    }

    public async stopRace() {
        this.events.emitNuiCallback(StopRace, null);
    }
}
