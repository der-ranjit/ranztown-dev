import { Component, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { Vec3 } from "fivem-js/lib/utils/Vector3";

import type { EntityJSON } from "../../fivem-scripts/serialization/EntityJson";
import { DefaultCallbackResponse, DeleteEntity, GetEntityAtCursor, GetEntityData, UpdateEntity } from "../../shared/nui-events/callbacks";
import { sleep } from "../../shared/utils";
import { isVec3 } from "../../shared/Vector";
import { AppNuiEventsService } from "../core/nui-events/nuiEvents.service";

@Component({
    selector: "app-entity-context-menu",
    template: `
         <div style="visibility: hidden; position: fixed"
            [style.left]="contextMenuPosition.x"
            [style.top]="contextMenuPosition.y"
            [matMenuTriggerFor]="contextMenu">
        </div>
        <mat-menu #contextMenu="matMenu">
            <div *ngFor="let property of entityJSON | keyvalue" (click)="$event.stopPropagation()">
                <span>{{ property.key }}</span>
                <pre *ngIf="property.value?.readonly"> {{ property.value?.value }}</pre>
                <ng-container *ngIf="!property.value?.readonly && isVector(property.value?.value) as vector">
                    <div><input type="number" [ngModel]="vector.x" (ngModelChange)="vector.x = $event; updateVectorProperty(property.key)"></div>
                    <div><input type="number" [ngModel]="vector.y" (ngModelChange)="vector.y = $event; updateVectorProperty(property.key)"></div>
                    <div><input type="number" [ngModel]="vector.z" (ngModelChange)="vector.z = $event; updateVectorProperty(property.key)"></div>
                </ng-container>
            </div>
            <button mat-menu-item (click)="deleteEntity(entityJSON?.Handle?.value)"> delete </button>
        </mat-menu>
    `,
    styles: [`
    `]
})
export class EntityContextMenuComponent implements OnInit, OnDestroy {
    @ViewChild(MatMenuTrigger)
    private contextMenuTrigger!: MatMenuTrigger;

    public entityJSON: EntityJSON | null = null;
    public contextMenuPosition = { x: "0px", y: "0px" };

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

    public close() {
        this.contextMenuTrigger.closeMenu();
    }

    @HostListener("window:contextmenu", ["$event"])
    public async onContextMenu(event: MouseEvent) {
        event.preventDefault();
        const result = await this.events.emitNuiCallback(GetEntityAtCursor, null);
        if (this.contextMenuTrigger.menuOpen) {
            this.contextMenuTrigger.closeMenu();
            // wait for menu closing animation
            await sleep(150);
        }

        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        if (result !== DefaultCallbackResponse) {
            this.entityJSON = result;
            this.contextMenuTrigger.openMenu();
        }
    }

    public deleteEntity(handle?: number) {
        if (handle) {
            this.events.emitNuiCallback(DeleteEntity, { handle });
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

    private getHandle(): number | null {
        return this.entityJSON?.Handle?.value ?? null;
    }

    /* call this after every change to the data, so the ui is nice and fresh */
    private async updateData() {
        const handle = this.getHandle();
        if (handle) {
            const result = await this.events.emitNuiCallback(GetEntityData, {handle});
            if (result !== DefaultCallbackResponse) {
                this.entityJSON = result;
            }
        }
    }
}
