import { AnimationEvent } from '@angular/animations';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Callback } from '../../shared/nui-events';
import { Vehicles } from '../../shared/Vehicles';
import { slideIn } from '../core/animations';
import { AppNuiEventsService } from '../core/nui-events/nuiEvents.service';

@Component({
    selector: 'nui-app-vehicle-menu',
    template: `
        <div class="vehicleListContainer" *ngIf="active" [@slideIn]="'left'" (@slideIn.done)="onCloseAnimationDone($event)">
            <div class="vehicleInputField">
                <input type="text"
                    exclusiveInput
                    #vehicleNameInput
                    placeholder="vehicle name"
                    [formControl]="vehicleNameFormControl"
                    (keydown.enter)="handleSpawn(vehicleNameInput.value)">
                <button mat-flat-button color="accent" (click)="handleSpawn(vehicleNameInput.value)">spawn</button>
            </div>
            <virtual-scroller [style.height.px]="virtualScrollerHeight" #scroll [items]="(filteredVehicleNames$ | async)!">
                <div *ngFor="let name of scroll.viewPortItems" class="vehicleItem"
                    [style.backgroundImage]="'url(assets/vehicle_thumbs/' + name +'.png)'"
                    (click)="handleSpawn(name)">
                    <div class="vehicleName">{{name}}</div>
                </div>
            </virtual-scroller>
        </div>

`,
    styles: [`
        @import "~src/themeVariables.scss";
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
            background-color: $backgroundColor;
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
        :host ::ng-deep .scrollable-content {
            display: flex;
            flex: 1;
            flex-wrap: wrap;
            justify-content: space-around;
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

    `],
    animations: [
        slideIn
    ]
})
export class VehicleMenuComponent implements OnInit {
    @Input()
    public active = false;

    @Output()
    public afterClose = new Subject();

    // TODO large list loads too long
    public vehiclesNames = [...Object.values(Vehicles)].map(vehicle => vehicle.name).sort();
    public filteredVehicleNames$!: Observable<string[]>;
    public vehicleNameFormControl = new FormControl();

    public virtualScrollerHeight: number | null = null;

    constructor(private events: AppNuiEventsService) {
    }

    public ngOnInit(): void {
        this.filteredVehicleNames$ = this.vehicleNameFormControl.valueChanges.pipe(
            startWith(''),
            map(value => this.filter(value))
        );
        // set virtualScroller height when items change; use css values and paddings/margins
        this.filteredVehicleNames$.subscribe(items => this.virtualScrollerHeight = (Math.ceil(items.length / 2) * (100 + 4)) + 8);
    }

    public handleSpawn(carModel: string): void {
        this.events.emitNuiCallback(Callback.SpawnVehicle, { model: carModel });
    }

    public onCloseAnimationDone(event: AnimationEvent) {
        if (event.toState === 'void') {
            this.afterClose.next();
        }
    }

    private filter(value: string): any[] {
        const filterValue = this.normalizeValue(value);
        return this.vehiclesNames.filter(name => this.normalizeValue(name).includes(filterValue));
    }

    private normalizeValue(value: string): string {
        return value.toLowerCase().replace(/\s/g, '');
    }

}
