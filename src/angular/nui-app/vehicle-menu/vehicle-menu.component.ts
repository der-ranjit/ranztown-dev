import { AnimationEvent } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { VehicleModType } from 'fivem-js';
import { Subject } from 'rxjs';

import { FivemVehicleJSON, isFivemVehicleJSON, ModTypeSlot } from '../../../angular-fivem-shared/serialization/FivemVehicleJSON';
import { Vehicles } from '../../../angular-fivem-shared/gta-data/Vehicles';
import { slideIn } from '../_core/animations';
import { AppNuiEventsService } from '../_core/nui-events/nui-events.service';
import { NuiCB } from '../../../angular-fivem-shared/nui-events/callbacks';

type ModValue = {modType: VehicleModType, modValue: number};

@Component({
    selector: 'nui-app-vehicle-menu',
    template: `
        <div class="vehicleListContainer" *ngIf="active" [@slideIn]="'left'" (@slideIn.done)="onCloseAnimationDone($event)">
            <mat-tab-group [disablePagination]="true" class="maxHeight">
                <mat-tab label="Spawn" ><ng-container *ngTemplateOutlet="spawnList"></ng-container></mat-tab>
                <mat-tab label="Edit"><ng-container *ngTemplateOutlet="editor"></ng-container></mat-tab>
            </mat-tab-group>
        </div>

        <ng-template #spawnList>
            <app-virtual-filter-list #scroll class="maxHeight"
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
        </ng-template>
        <ng-template #editor>
            <div class="editorFields" *ngFor="let slot of modSlots">
                <mat-form-field *ngIf="slot.slotValues.length > 1" appearance="fill" class="maxHeight">
                    <mat-label>{{ slot.slotType | modSlotName }} ({{slot.slotValues.length}})</mat-label>
                    <mat-select (selectionChange)="onModTypeSelectionChange(slot.slotType, $event.value)"
                        (openedChange)="onSelectOpenChanged($event, slot.slotType, slot.selectedValue.value)"
                        [value]="slot.selectedValue.value">
                        <mat-option *ngFor="let modValue of slot.slotValues; let i = index;"
                            (mouseenter)="onMouseEnterModType(slot.slotType, modValue.value)"
                            (mouseleave)="onMouseLeaveModType()"
                            [value]="modValue.value">{{ modValue.displayName | modValueName:slot.slotType:i}}</mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
        </ng-template>
`,
    styles: [`
        :host {
            position: relative;
            display: flex;
            flex: 1;
            flex-direction: column;
            overflow: hidden;
        }
        .overflowWrapper {
            overflow-y: scroll;
            display: flex;
            flex-direction: column;
        }
        .vehicleEditorContainer {
            position: absolute;
            right: 0px;
            display: flex;
            flex-direction: column;
            max-height: 100%;
            max-width: 300px;
            background-color: var(--background-color);
        }
        .vehicleListContainer {
            display: flex;
            flex-direction: column;
            max-width: 300px;
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
        .maxHeight {
            max-height: 100%;
        }
        .editorFields {
            display: flex;
            flex-wrap: wrap;
        }

    `],
    animations: [
        slideIn
    ]
})
export class VehicleMenuComponent implements OnInit, OnDestroy {
    @Input()
    public active = false;

    @Output()
    public afterClose = new Subject();

    public vehiclesNames = [...Object.values(Vehicles)].map(vehicle => vehicle.name).sort();

    public vehicleJSON: FivemVehicleJSON | null = null;

    public get modSlots(): ModTypeSlot[] {
        return this.vehicleJSON?.Mods?.value.ModTypeSlots?.value ?? [];
    }

    // used to save the selected mod type when starting to hover options
    public modTypeValueOnSelectionStart: ModValue | null = null;
    public isModTypeSelectionActive = false;

    constructor(private events: AppNuiEventsService) {
    }

    public ngOnInit() {
        this.updateVehicleData();
    }

    public ngOnDestroy() {
        this.restoreModType();
    }

    public async updateVehicleData() {
        const result = await this.events.emitNuiCallback(NuiCB.VehicleManager.GetPlayerVehicleData, null);
        if (isFivemVehicleJSON(result)) {
            this.vehicleJSON = result;
        }
    }

    public async handleSpawn(carModel: string) {
        await this.events.emitNuiCallback(NuiCB.VehicleManager.SpawnVehicle, { model: carModel });
        this.updateVehicleData();
    }

    public onCloseAnimationDone(event: AnimationEvent) {
        if (event.toState === 'void') {
            this.afterClose.next();
        }
    }

    public async onModTypeSelectionChange(modType: VehicleModType, modValue: number) {
        this.updateVehicleMod(modType, modValue);
        this.isModTypeSelectionActive = false;
        this.modTypeValueOnSelectionStart = null;
    }

    /* updateData parameter is useful to prevent the ui from resetting its data when e.g hovering over options */
    public async updateVehicleMod(modType: VehicleModType, modValue: number, updateData = true) {
        const vehicleHandle = this.vehicleJSON?.Handle?.value;
        if (vehicleHandle) {
            await this.events.emitNuiCallback(NuiCB.VehicleManager.UpdateVehicleMod, { vehicleHandle, modType, modValue });
            if (updateData) {
                this.updateVehicleData();
            }
        }
    }

    public onSelectOpenChanged(opened: boolean, modType: VehicleModType, modValue: number) {
        if (opened) {
            this.modTypeValueOnSelectionStart = { modValue, modType };
            this.isModTypeSelectionActive = true;
        } else {
            // only false when closed without selecting a new value
            this.restoreModType();
            this.modTypeValueOnSelectionStart = null;
            this.isModTypeSelectionActive = false;
        }
    }

    public onMouseEnterModType(modType: VehicleModType, modValue: number) {
        if (this.isModTypeSelectionActive) {
            this.updateVehicleMod(modType, modValue, false);
        }
    }

    public onMouseLeaveModType() {
        if (this.isModTypeSelectionActive) {
            this.restoreModType(false);
        }
    }

    private restoreModType(updateData = true) {
        if (this.modTypeValueOnSelectionStart) {
            const {modType, modValue} = this.modTypeValueOnSelectionStart;
            this.updateVehicleMod(modType, modValue, updateData);
        }
    }
}
