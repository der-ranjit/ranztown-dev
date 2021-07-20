import { Component } from '@angular/core';

import { Callback } from '../../shared/nui-events';
import { Vehicles } from '../../shared/Vehicles';
import { AppNuiEventsService } from '../core/nui-events/nuiEvents.service';

@Component({
    selector: 'nui-app-vehicle-menu',
    template: `
        <mat-accordion [style.maxHeight]="'100%'">
            <mat-expansion-panel>
                <mat-expansion-panel-header>
                    <mat-panel-title>
                        <mat-form-field appearance="fill" class="vehicleNameField">
                            <mat-label>Vehicle name</mat-label>
                            <input type="text" #vehicleName matInput>
                            <mat-hint>enter a vehicle name</mat-hint>
                        </mat-form-field>
                        <button mat-raised-button (click)="handleSpawnCar(vehicleName.value)">Spawn car</button>
                    </mat-panel-title>
                    <mat-panel-description>
                        This is a summary of the content
                    </mat-panel-description>
                </mat-expansion-panel-header>
                <div class="vehicleList">
                    <div *ngFor="let vehicle of vehicles" class="vehicleItem"
                        [style.backgroundImage]="'url(assets/vehicle_thumbs/' + vehicle.name +'.png)'"
                        (click)="handleSpawnCar(vehicle.name)">
                        <div class="vehicleName">{{vehicle.name}}</div>
                    </div>
                </div>
            </mat-expansion-panel>
        </mat-accordion>

`,
    styles: [`
        :host {
            display: flex;
            flex: 1;
            flex-direction: column;
            overflow: hidden;
        }
        .vehicleNameField {
            background-color: white;
        }
        .vehicleList {
            display: flex;
            flex-wrap: wrap;
            overflow-y: auto;
            justify-content: space-around;
        }
        .vehicleItem {
            position: relative;
            width: 120px;
            height: 100px;
            margin-top: 4px;
            border: solid 1px black;
            border-radius: 5px;
            background-size: contain;
            background-repeat: no-repeat;
            background-color: white;
            background-position: center;
        }
        .vehicleName {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -3px;
            display: flex;
            justify-content: center;
            color: black
        }
        :host ::ng-deep .mat-expansion-panel-body {
            padding: 0;
        }
    `]
})
export class VehicleMenuComponent {
    // TODO large list loads too long
    public vehicles = [...Object.values(Vehicles)];

    constructor(private events: AppNuiEventsService) {
    }

    public async handleSpawnCar(carModel: string): Promise<void> {
        const result = await this.events.emitNuiCallback(Callback.SpawnVehicle, { model: carModel });
    }
}
