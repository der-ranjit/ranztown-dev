import { Component, HostListener, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";

import { DeleteEntity, EntityInformation, GetEntityAtCursor } from "../shared/nui-events/callbacks";
import { sleep } from "../shared/utils";
import { AppNuiEventsService } from "./core/nui-events/nuiEvents.service";

@Component({
    selector: "app-entity-context-menu",
    template: `
         <div style="visibility: hidden; position: fixed"
            [style.left]="contextMenuPosition.x"
            [style.top]="contextMenuPosition.y"
            [matMenuTriggerFor]="contextMenu">
        </div>
        <mat-menu #contextMenu="matMenu">
            <pre>{{entityData | json}}</pre>
            <button mat-menu-item (click)="deleteEntity(entityData?.handle)"> delete </button>
        </mat-menu>
    `,
    styles: [`
    `]
})
export class EntityContextMenuComponent {
    @ViewChild(MatMenuTrigger)
    private contextMenuTrigger!: MatMenuTrigger;

    public entityData: EntityInformation | null = null;
    public contextMenuPosition = {x: "0px", y: "0px"};

    constructor(private events: AppNuiEventsService) {}

    public close() {
        this.contextMenuTrigger.closeMenu();
    }

    @HostListener("window:contextmenu", ["$event"])
    public async onContextMenu(event: MouseEvent) {
        event.preventDefault();
        const result = await this.events.emitNuiCallback(GetEntityAtCursor, null);
        if(this.contextMenuTrigger.menuOpen) {
            this.contextMenuTrigger.closeMenu();
            // wait for menu closing animation
            await sleep(150);
        }

        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        if (typeof result === "object") {
            this.entityData = result;
            this.contextMenuTrigger.openMenu();
        }
    }

    public deleteEntity(handle?: number) {
        if (handle) {
            this.events.emitNuiCallback(DeleteEntity, {handle});
        }
    }
}
