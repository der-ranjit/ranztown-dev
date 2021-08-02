import { AnimationEvent } from '@angular/animations';
import { Component, Input, OnInit, Output } from '@angular/core';
import { VehicleModType } from 'fivem-js';
import { Subject } from 'rxjs';

import { Callback } from '../../../shared/nui-events';
import { GetPlayerVehicleData } from '../../../shared/nui-events/callbacks';
import { FivemVehicleJSON, isFivemVehicleJSON, ModTypeSlot } from '../../../shared/serialization/FivemVehicleJSON';
import { Vehicles } from '../../../shared/Vehicles';
import { slideIn } from '../core/animations';
import { AppNuiEventsService } from '../core/nui-events/nuiEvents.service';

@Component({
    selector: 'nui-app-vehicle-menu',
    template: `
        <div class="rightMenu" *ngIf="active" [@slideIn]="'right'">
            <div *ngFor="let slot of modSlots">
                <div>{{ slot.slotType | modSlotName}}</div>
                <div *ngFor="let modValue of slot.slotValues" (click)="updateVehicleMod(slot.slotType, modValue.value)">{{ modValue.displayName }} : {{ modValue.value }}</div>
            </div>
        </div>
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
        .rightMenu {
            position: absolute;
            right: 0px;
            width: 300px;
            background-color: white;
            opacity: .8;
            max-width: 300px;
            max-height: 600px;
            overflow-y: scroll;
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
export class VehicleMenuComponent implements OnInit {
    @Input()
    public active = false;

    @Output()
    public afterClose = new Subject();

    public vehiclesNames = [...Object.values(Vehicles)].map(vehicle => vehicle.name).sort();

    public vehicleJSON: FivemVehicleJSON | null = null;

    public get modSlots(): ModTypeSlot[] {
        return this.vehicleJSON?.Mods?.value.ModTypeSlots?.value ?? [];
    }

    constructor(private events: AppNuiEventsService) {
    }

    public ngOnInit() {
        this.updateVehicleData();
    }

    public async updateVehicleData() {
        const result = await this.events.emitNuiCallback(GetPlayerVehicleData, null);
        if (isFivemVehicleJSON(result)) {
            this.vehicleJSON = result;
        }
    }

    public async handleSpawn(carModel: string) {
        await this.events.emitNuiCallback(Callback.SpawnVehicle, { model: carModel });
        this.updateVehicleData();
    }

    public onCloseAnimationDone(event: AnimationEvent) {
        if (event.toState === 'void') {
            this.afterClose.next();
        }
    }

    public async updateVehicleMod(modType: VehicleModType, modValue: number) {
        const vehicleHandle = this.vehicleJSON?.Handle?.value;
        if (vehicleHandle) {
            await this.events.emitNuiCallback(Callback.UpdateVehicleMod, { vehicleHandle, modType, modValue });
            this.updateVehicleData();
        }
    }
}
