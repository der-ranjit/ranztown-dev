import { Component, ViewChild } from '@angular/core';
import { Message } from '../../shared/nui-events';
import { NuiMode } from '../../shared/nui-events/messages';
import { fade, slideIn } from './core/animations';
import { NuiMessageEvents, NuiMessageListener } from './core/nui-events/decorators';

// init screen-shot basic script
import "./core/screenshot-basic";
import { EntityContextMenuComponent } from './entityContextMenu/entityContextMenu';

type MenuType = 'vehicleMenu' | 'pedMenu' |'locationMenu' | 'flyHighSpecial' | null;

@Component({
    selector: 'nui-app-root',
    template: `
        <button mat-raised-button @fade *ngIf="!isNuiActive" class="menuInfo" color="accent">Tap X to open menu - hold for inspect-mode</button>
        <button mat-raised-button @fade *ngIf="isInspectorActive" class="menuInfo" color="primary">inspect-mode right click an entity to inspect it</button>
        <mat-toolbar *ngIf="isMenuActive" [@slideIn]="'top'">
            <button mat-raised-button [color]="(isSubMenuActive('vehicleMenu') ? 'primary' : null)" (click)="setMenuActive('vehicleMenu')">Vehicle Menu</button>
            <button mat-raised-button [color]="(isSubMenuActive('pedMenu') ? 'primary' : null)" (click)="setMenuActive('pedMenu')">Ped Menu</button>
            <button mat-raised-button [color]="(isSubMenuActive('locationMenu')? 'primary' : null)" (click)="setMenuActive('locationMenu')">Locations Menu</button>
            <button mat-raised-button [color]="(isSubMenuActive('flyHighSpecial')? 'primary' : null)" (click)="setMenuActive('flyHighSpecial')">Fligh High Special</button>
            <span class="toolbar-spacer"></span>
            <app-theme-chooser-button></app-theme-chooser-button>
        </mat-toolbar>
        <div class="mainWrapper">
            <nui-app-vehicle-menu [active]="isMenuActive" (afterClose)="setMenuActive(null)" *ngIf="isSubMenuActive('vehicleMenu')"></nui-app-vehicle-menu>
            <nui-app-ped-menu [active]="isMenuActive" (afterClose)="setMenuActive(null)" *ngIf="isSubMenuActive('pedMenu')"></nui-app-ped-menu>
            <nui-app-locations-menu [active]="isMenuActive" (afterClose)="setMenuActive(null)" *ngIf="isSubMenuActive('locationMenu')"></nui-app-locations-menu>
            <nui-app-fly-high [active]="isMenuActive" (afterClose)="setMenuActive(null)" *ngIf="isSubMenuActive('flyHighSpecial')"></nui-app-fly-high>
        </div>
        <app-entity-context-menu *ngIf="isInspectorActive"></app-entity-context-menu>

    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            flex: 1;
            height: 100%;
            max-height: 100%;
        }
        .mainWrapper {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
            opacity: .85;
        }
        .menuInfo {
            position: absolute;
            left: 10px;
            top: 10px;
            opacity: 0.8;
        }
        mat-toolbar {
            opacity: .7;
        }
        mat-toolbar button {
            margin: 0 4px;
        }

        .toolbar-spacer {
            flex: 1 1 auto;
        }
    `],
    animations: [
        fade,
        slideIn
    ]
})
@NuiMessageEvents
export class AppRootComponent {
    @ViewChild(EntityContextMenuComponent)
    public entityContextMenu: EntityContextMenuComponent | null = null;

    public nuiMode: NuiMode = "inactive";
    public activeMenu: MenuType = null;
    public previouslyActiveMenu: MenuType = null;

    @NuiMessageListener(Message.SetNuiMode)
    private handleSetNuiMode(event: Message.SetNuiMode) {
        this.setNuiMode(event.data.nuiMode);
    }

    public get isNuiActive(): boolean {
        return this.nuiMode !== "inactive";
    }

    public get isInspectorActive(): boolean {
        return this.nuiMode === "inspector";
    }

    public get isMenuActive(): boolean {
        return this.nuiMode === "menu";
    }

    private setNuiMode(nuiMode: NuiMode): void {
        this.nuiMode = nuiMode;
        if (nuiMode === "inactive") {
            this.entityContextMenu?.close();
            this.previouslyActiveMenu = this.activeMenu;
        } else {
            this.activeMenu = this.previouslyActiveMenu;
        }
    }

    public isSubMenuActive(menu: MenuType) {
        return this.activeMenu === menu;
    }

    public setMenuActive(menu: MenuType) {
        this.activeMenu = menu;
    }
}
