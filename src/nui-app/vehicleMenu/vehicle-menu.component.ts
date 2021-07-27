import { AnimationEvent } from '@angular/animations';
import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { Callback } from '../../shared/nui-events';
import { Vehicles } from '../../shared/Vehicles';
import { slideIn } from '../core/animations';
import { AppNuiEventsService } from '../core/nui-events/nuiEvents.service';

@Component({
    selector: 'nui-app-vehicle-menu',
    template: `
        <div class="vehicleListContainer" *ngIf="active" [@slideIn]="'left'" (@slideIn.done)="onCloseAnimationDone($event)">
            <app-virtual-filter-list #scroll
                [items]="vehiclesNames"
                [filterLabel]="'vehicle name'"
                [filterDescription]="'press enter or click to spawn'"
                (onEnter)="handleSpawn(scroll.currentFilterValue)">
                <div *ngFor="let name of scroll.filteredViewportItems" class="virtualFilterItem"
                    [style.backgroundImage]="'url(assets/vehicle_thumbs/' + name +'.png)'"
                    (click)="handleSpawn(name)">
                    <div class="vehicleName">{{name}}</div>
                </div>
            </app-virtual-filter-list>
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
            background-color: var(--background-color);
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
export class VehicleMenuComponent {
    @Input()
    public active = false;

    @Output()
    public afterClose = new Subject();

    // TODO large list loads too long
    public vehiclesNames = [...Object.values(Vehicles)].map(vehicle => vehicle.name).sort();

    constructor(private events: AppNuiEventsService) {
    }

    public handleSpawn(carModel: string): void {
        this.events.emitNuiCallback(Callback.SpawnVehicle, { model: carModel });
    }

    public onCloseAnimationDone(event: AnimationEvent) {
        if (event.toState === 'void') {
            this.afterClose.next();
        }
    }
}
