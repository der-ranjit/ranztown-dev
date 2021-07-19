import { Component } from '@angular/core';

import { Callback } from '../../shared/nui-events';
import { Vehicles } from '../../shared/Vehicles';
import { AppNuiEventsService } from '../core/nuiEvents.service';

@Component({
    selector: 'nui-app-vehicle-menu',
    template: `
        <mat-form-field appearance="fill" class="field">
            <mat-label>Enter car model</mat-label>
            <input type="text" #carModel matInput>
        </mat-form-field>
        <button mat-raised-button (click)="handleSpawnCar(carModel.value)">Spawn car</button>
        <button *ngFor="let vehicle of vehicles" mat-raised-button (click)="handleSpawnCar(vehicle.name)">{{vehicle.name}}</button>
`,
    styles: [`
        :host {
            overflow-y: auto;
        }
        .field {
            background-color: white;
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
