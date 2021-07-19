import { Component } from '@angular/core';

import { Callback } from '../../shared/nui-events';
import { Vehicles } from '../../shared/Vehicles';
import { AppNuiEventsService } from '../core/nuiEvents.service';

@Component({
    selector: 'nui-app-vehicle-menu',
    template: `
        <mat-form-field appearance="fill" class="vehicleNameField">
            <mat-label>Enter vehicle name</mat-label>
            <input type="text" #vehicleName matInput>
        </mat-form-field>
        <button mat-raised-button (click)="handleSpawnCar(vehicleName.value)">Spawn car</button>
        <div class="vehicleList">
            <button *ngFor="let vehicle of vehicles" mat-raised-button (click)="handleSpawnCar(vehicle.name)">{{vehicle.name}}</button>
        </div>
`,
    styles: [`
        :host {
            display: flex;
            flex: 1;
            flex-direction: column;
            overflow: hidden;
            border: solid 2px #dedede;
        }
        .vehicleNameField {
            background-color: white;
        }
        .vehicleList {
            display: flex;
            flex-wrap: wrap;
        }
`]
})
export class VehicleMenuComponent {
    // TODO large list loads too long
    public vehicles = [...Object.values(Vehicles)].slice(0,10);

    constructor(private events: AppNuiEventsService) {
    }

    public async handleSpawnCar(carModel: string): Promise<void> {
        const result = await this.events.emitNuiCallback(Callback.SpawnVehicle, { model: carModel });
    }

}
