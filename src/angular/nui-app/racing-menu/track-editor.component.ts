import { Component, OnDestroy, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { Color } from "fivem-js/lib/utils/Color";

import { CheckpointPosition } from "../../../angular-fivem-shared/Racing";
import { AppNuiEventsService } from "../_core/nui-events/nui-events.service";
import { cssHexStringToRgb } from "../../../fivem-scripts/client-server-shared/Colors";
import { NuiCB } from "../../../angular-fivem-shared/nui-events/callbacks";

@Component({
    selector: "nui-track-editor",
    template: `
        <div><button mat-raised-button color="primary" (click)="saveTrack()" [disabled]="!canSave">save</button></div>
        <mat-form-field appearance="fill">
            <mat-label>track name</mat-label>
            <input type="text" matInput [(ngModel)]="trackName">
        </mat-form-field>
        <mat-form-field appearance="fill">
            <mat-label>track description</mat-label>
            <input type="textarea" matInput [(ngModel)]="trackDescription">
        </mat-form-field>
        <mat-form-field appearance="fill">
            <mat-label>rounds number</mat-label>
            <input type="number" min="1" matInput [(ngModel)]="raceRounds">
        </mat-form-field>

        <button mat-raised-button (click)="addCurrentPositionAsTempCheckpoint()">create checkpoint</button>
        <div><mat-checkbox [(ngModel)]="nextCheckpointClipToGround">clip to ground</mat-checkbox></div>
        <div><input type="number" [(ngModel)]="nextCheckpointRadius">radius</div>
        <div><input type="color" [(ngModel)]="nextCheckpointColorInput">color</div>
        <div *ngFor="let checkpoint of checkpoints;let i=index">
            <div>{{i}}</div>
            <!-- <div>{{ checkpoint | json }}</div> -->
        </div>
    `,
    styles: [`
        :host {
            display: block;
        }
    `]
})
export class TrackEditorComponent implements OnInit, OnDestroy {
    @Output()
    public onTrackSaved = new Subject<void>();

    public get canSave(): boolean {
        return this.trackName.length > 0
            && this.checkpoints.length > 1
            && this.raceRounds > 0
    }

    public raceRounds = 1;
    public trackDescription = "";
    public trackName = "";

    public checkpoints: CheckpointPosition[] = [];
    public nextCheckpointClipToGround = true;
    public nextCheckpointRadius = 10;
    public nextCheckpointColorInput = "#ffffff";

    constructor(private events: AppNuiEventsService) {}

    public ngOnInit() {
        this.events.emitNuiCallback(NuiCB.NoClip.SetNoClipAboveGround, {active: true});
    }

    public ngOnDestroy() {
        this.events.emitNuiCallback(NuiCB.Racing.EditRaceStopEdit, null);
        this.events.emitNuiCallback(NuiCB.NoClip.SetNoClipAboveGround, {active: false});
    }

    public async saveTrack() {
        const track = {
            id: "unset",
            userId: "unset",
            name: this.trackName,
            description: this.trackDescription,
            defaultRounds: this.raceRounds,
            checkpointPositions: this.checkpoints
        };
        const result = await this.events.emitNuiCallback(NuiCB.Racing.EditRaceSave, { track });
        this.events.emitNuiCallback(NuiCB.Racing.EditRaceStopEdit, null);
        this.onTrackSaved.next();
    }

    public async addCurrentPositionAsTempCheckpoint() {
        const currentPosition = await this.events.emitNuiCallback(NuiCB.Locations.GetCurrentPlayerPosition, null);
        const {x, y, z} = currentPosition;

        const checkpointPosition: CheckpointPosition = {
            position: {x, y, z},
            heading: currentPosition.heading,
            clipToGround: this.nextCheckpointClipToGround,
            radius: this.nextCheckpointRadius,
            color: this.createColorFromInputString()
        };
        this.events.emitNuiCallback(NuiCB.Racing.EditRaceAddTempPosition, checkpointPosition)
        this.checkpoints.push(checkpointPosition);
    }

    private createColorFromInputString(): Color {
        const rgbColor = cssHexStringToRgb(this.nextCheckpointColorInput);
        let color = Color.white
        if (rgbColor != null) {
            color = Color.fromRgb(rgbColor.r, rgbColor.g, rgbColor.b)
        }
        return color;
    }
}
