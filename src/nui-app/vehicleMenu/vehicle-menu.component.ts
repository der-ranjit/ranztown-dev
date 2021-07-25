import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Callback } from '../../shared/nui-events';
import { Vehicles } from '../../shared/Vehicles';
import { AppNuiEventsService } from '../core/nui-events/nuiEvents.service';

@Component({
    selector: 'nui-app-vehicle-menu',
    template: `
        <div class="vehicleListContainer">
            <div class="vehicleInputField">
                <input type="text"
                    exclusiveInput
                    #vehicleNameInput
                    placeholder="vehicle name"
                    [formControl]="vehicleNameFormControl"
                    (keydown.enter)="handleSpawn(vehicleNameInput.value)">
                <button mat-flat-button color="accent" (click)="handleSpawn(vehicleNameInput.value)">spawn</button>
            </div>
            <div class="vehicleList">
                <div *ngFor="let name of filteredVehicleNames$ | async" class="vehicleItem"
                    [style.backgroundImage]="'url(assets/vehicle_thumbs/' + name +'.png)'"
                    (click)="handleSpawn(name)">
                    <div class="vehicleName">{{name}}</div>
                </div>
            </div>
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
        .vehicleListContainer {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background-color: #424242;
        }
        .vehicleInputField {
            height: 48px;
            display: flex;
            justify-content: center;
            margin: 8px 0;

            input {
                margin-right: 8px;
        	    border-radius: 4px;
            }
        }
        .vehicleList {
            display: flex;
            flex: 1;
            flex-wrap: wrap;
            justify-content: space-around;
            overflow-y: auto;
            padding-bottom: 8px;
        }
        .vehicleItem {
            position: relative;
            width: 120px;
            height: 100px;
            margin-top: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
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

    `]
})
export class VehicleMenuComponent implements OnInit {
    // TODO large list loads too long
    public vehiclesNames = [...Object.values(Vehicles)].map(vehicle => vehicle.name).sort();
    public filteredVehicleNames$!: Observable<string[]>;
    public vehicleNameFormControl = new FormControl();

    constructor(private events: AppNuiEventsService) {
    }

    public ngOnInit(): void {
        this.filteredVehicleNames$ = this.vehicleNameFormControl.valueChanges.pipe(
            startWith(''),
            map(value => this.filter(value))
        );
    }

    public handleSpawn(carModel: string): void {
        this.events.emitNuiCallback(Callback.SpawnVehicle, { model: carModel });
    }

    private filter(value: string): any[] {
        const filterValue = this.normalizeValue(value);
        return this.vehiclesNames.filter(name => this.normalizeValue(name).includes(filterValue));
    }

    private normalizeValue(value: string): string {
        return value.toLowerCase().replace(/\s/g, '');
    }

}
