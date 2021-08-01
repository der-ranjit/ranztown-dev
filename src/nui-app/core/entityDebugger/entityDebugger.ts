import { Component, OnDestroy, OnInit } from "@angular/core";
import { Vec3 } from "fivem-js/lib/utils/Vector3";

import { EntityJSON } from "../../../fivem-scripts/serialization/EntityJson";
import { VehicleJSON } from "../../../fivem-scripts/serialization/VehicleJson";
import { DefaultCallbackResponse, GetEntityData, UpdateEntity } from "../../../shared/nui-events/callbacks";
import { isVec3 } from "../../../shared/Vector";
import { AppNuiEventsService } from "../nui-events/nuiEvents.service";

@Component({
    selector: "app-entity-debugger",
    template: `
        <div *ngFor="let property of entityJSON | keyvalue" (click)="$event.stopPropagation()">
            <span>{{ property.key }}</span>
            <pre *ngIf="property.value?.readonly"> {{ property.value?.value | json }}</pre>
            <ng-container *ngIf="!property.value?.readonly && isVector(property.value?.value) as vector">
                <div><input type="number" [ngModel]="vector.x" (ngModelChange)="vector.x = $event; updateVectorProperty(property.key)"></div>
                <div><input type="number" [ngModel]="vector.y" (ngModelChange)="vector.y = $event; updateVectorProperty(property.key)"></div>
                <div><input type="number" [ngModel]="vector.z" (ngModelChange)="vector.z = $event; updateVectorProperty(property.key)"></div>
            </ng-container>
        </div>
    `,
    styles: [``]
})
export class EntityDebuggerComponent implements OnInit, OnDestroy {
    public entityJSON: EntityJSON | VehicleJSON | null = null;

    private entityUpdateIntervalMS = 100;
    private entityUpdateInterval: number | null = null;

    constructor(private events: AppNuiEventsService) { }

    public ngOnInit() {
        this.entityUpdateInterval = <any>setInterval(
            async () => await this.updateData(),
            this.entityUpdateIntervalMS
        );
    }

    public ngOnDestroy() {
        if (this.entityUpdateInterval != null) {
            clearInterval(this.entityUpdateInterval);
        }
    }

    public isVector(value: any): Vec3 | null {
        return isVec3(value) ? value: null;
    }

    public async updateVectorProperty(propertyKey: string) {
        const vector = (<any>this.entityJSON)[propertyKey].value as Vec3;
        const handle = this.getHandle();
        if (handle != null) {
            await this.events.emitNuiCallback(UpdateEntity, {handle, propertyPaths: [propertyKey], value: vector});
            await this.updateData();
        }
    }


    /* call this after every change to the data, so the ui is nice and fresh */
    private async updateData() {
        const handle = this.getHandle();
        if (handle) {
            const result = await this.events.emitNuiCallback(GetEntityData, { handle });
            if (result !== DefaultCallbackResponse) {
                this.entityJSON = result;
            }
        }
    }

    private getHandle(): number | null {
        return this.entityJSON?.Handle?.value ?? null;
    }
}
