import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop/drag-events';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Callback } from '../../shared/nui-events';
import { Vehicles } from '../../shared/Vehicles';
import { AppNuiEventsService } from '../core/nui-events/nuiEvents.service';

// TODO this only works for one component and needs to be refactored
let dragPosition = {x: 0, y: 0};

@Component({
    selector: 'nui-app-vehicle-menu',
    template: `
        <mat-autocomplete #auto="matAutocomplete" #autoElem>
            <mat-option *ngFor="let name of filteredVehicleNames$ | async" [value]="name">
                {{name}}
            </mat-option>
        </mat-autocomplete>
        <mat-accordion cdkDrag
            [cdkDragFreeDragPosition]="dragPosition"
            (cdkDragEnded)="onDragEnd($event)"
            [style.maxWidth]="'300px'">
            <mat-expansion-panel (opened)="setAutoCompleteEnabled(false)" (closed)="setAutoCompleteEnabled(true)">
                <mat-expansion-panel-header [collapsedHeight]="'48px'" [expandedHeight]="'48px'" cdkDragHandle>
                    <mat-panel-title (click)="$event.stopPropagation();" (keydown)="$event.keyCode == 27 ? null : $event.stopPropagation();">
                        <input type="text"
                            exclusiveInput
                            #autoComplete
                            placeholder="vehicle name"
                            [formControl]="vehicleNameFormControl"
                            [matAutocomplete]="auto"
                            [matAutocompleteDisabled]="!autoCompleteEnabled"
                            (keydown.enter)="handleSpawn(autoComplete.value)">

                        <button mat-flat-button color="accent" (click)="handleSpawn(autoComplete.value)">spawn</button>
                    </mat-panel-title>
                </mat-expansion-panel-header>
                <div class="vehicleList">
                    <div *ngFor="let name of filteredVehicleNames$ | async" class="vehicleItem"
                        [style.backgroundImage]="'url(assets/vehicle_thumbs/' + name +'.png)'"
                        (click)="handleSpawn(name)">
                        <div class="vehicleName">{{name}}</div>
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
        }
        .vehicleNameField {
            background-color: white;
        }
        .vehicleList {
            display: flex;
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
        :host ::ng-deep mat-expansion-panel-header {
            padding: 8px;
        }
        :host ::ng-deep .mat-expansion-panel-body {
            padding: 0;
            max-height: 700px;
            overflow: auto;
        }
        :host ::ng-deep mat-panel-title {
            margin-right: 14px;
            justify-content: space-around;
        }
    `]
})
export class VehicleMenuComponent implements OnInit {
    // TODO large list loads too long
    public vehiclesNames = [...Object.values(Vehicles)].map(vehicle => vehicle.name).sort();
    public filteredVehicleNames$!: Observable<string[]>;
    public vehicleNameFormControl = new FormControl();

    public autoCompleteEnabled = true;

    public dragPosition = dragPosition;

    constructor(private events: AppNuiEventsService) {
    }

    public ngOnInit(): void {
        this.filteredVehicleNames$ = this.vehicleNameFormControl.valueChanges.pipe(
            startWith(''),
            map(value => this.filter(value))
        );
        this.dragPosition = dragPosition
    }

    public setAutoCompleteEnabled(enabled: boolean): void {
        this.autoCompleteEnabled = enabled;
    }

    public async handleSpawn(carModel: string): Promise<void> {
        const result = await this.events.emitNuiCallback(Callback.SpawnVehicle, { model: carModel });
    }

    public onDragEnd(event: CdkDragEnd) {
        const { x, y } = event.source.element.nativeElement.getBoundingClientRect();
        dragPosition = {x, y};
      }

    private filter(value: string): any[] {
        const filterValue = this.normalizeValue(value);
        return this.vehiclesNames.filter(name => this.normalizeValue(name).includes(filterValue));
    }

    private normalizeValue(value: string): string {
        return value.toLowerCase().replace(/\s/g, '');
    }

}
