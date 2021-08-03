import { Component, HostListener, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";

import { DeleteEntity, EntityType, GetEntityDataAtNuiCursor } from "../../../angular-fivem-shared/nui-events/callbacks";
import { FivemEntityJSON, isFivemEntityJSON } from "../../../angular-fivem-shared/serialization/FivemEntityJSON";
import { FivemVehicleJSON, isFivemVehicleJSON } from "../../../angular-fivem-shared/serialization/FivemVehicleJSON";
import { sleep } from "../../../angular-fivem-shared/utils";
import { AppNuiEventsService } from "../core/nui-events/nuiEvents.service";

@Component({
    selector: "app-entity-context-menu",
    template: `
        <!-- positioned wrapper to open mat-menu at cursor position -->
        <div style="visibility: hidden; position: fixed"
            [style.left]="contextMenuPosition.x"
            [style.top]="contextMenuPosition.y"
            [matMenuTriggerFor]="contextMenu">
        </div>

        <mat-menu #contextMenu="matMenu">
            <div> {{ entityType }}</div>
            <button mat-menu-item (click)="deleteEntity(entityJSON?.Handle?.value)"> delete </button>
        </mat-menu>
    `,
    styles: [`
    `]
})
export class EntityContextMenuComponent  {
    @ViewChild(MatMenuTrigger)
    private contextMenuTrigger!: MatMenuTrigger;

    public entityType: EntityType = "no entity";

    public entityJSON: FivemEntityJSON | FivemVehicleJSON | null = null;
    public contextMenuPosition = { x: "0px", y: "0px" };

    constructor(private events: AppNuiEventsService) { }

    public close() {
        this.contextMenuTrigger.closeMenu();
    }

    @HostListener("window:contextmenu", ["$event"])
    public async onContextMenu(event: MouseEvent) {
        event.preventDefault();
        const result = await this.events.emitNuiCallback(GetEntityDataAtNuiCursor, null);
        if (this.contextMenuTrigger.menuOpen) {
            this.contextMenuTrigger.closeMenu();
            // wait for menu closing animation
            await sleep(150);
        }

        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        if (isFivemEntityJSON(result)) {
            this.entityType = isFivemVehicleJSON(result) ? "vehicle" : "object";
            this.entityJSON = result;
            this.contextMenuTrigger.openMenu();
        }
    }

    public deleteEntity(handle?: number) {
        if (handle) {
            this.events.emitNuiCallback(DeleteEntity, { handle });
        }
    }
}
