import { Component, OnInit } from '@angular/core';
import { Events } from 'src/shared/events';
import { FiveMClientService } from './core/fivemClient.service';

@Component({
    selector: 'app-root',
    template: `
        <mat-form-field appearance="fill" class="field">
            <mat-label>Enter car model</mat-label>
            <input type="text" #carModel matInput>
        </mat-form-field>
        <button mat-raised-button (click)="handleSpawnCar(carModel.value)">Spawn car</button>
        <button *ngFor="let vehicleName of availableVehicleNames" mat-raised-button (click)="handleSpawnCar(vehicleName)">{{vehicleName}}</button>
    `,
    styles: [`
        .field {
            background-color: white;
        }
    `]
})
export class AppRootComponent implements OnInit {
    public availableVehicleNames: string[] = [];

    constructor(private fivemClient: FiveMClientService) {
    }

    public async ngOnInit(): Promise<void> {
        const result = await this.fivemClient.invoke(Events.GetAvailableVehicleNames, null);
        this.availableVehicleNames = result?.vehicleNames ?? [];
    }

    public async handleSpawnCar(carModel: string): Promise<void> {
        const result = await this.fivemClient.invoke(Events.SpawnCar, { model: carModel });
    }

    public async getAvailableVehicleNames(): Promise<void> {
        const result = await this.fivemClient.invoke(Events.GetAvailableVehicleNames, null);
        console.log(result?.vehicleNames);
    }
}
