import { Component, HostListener, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Message } from '../shared/nui-events';
import { GetEntityAtCursor, GetEntityAtCursorResponseData } from '../shared/nui-events/callbacks';
import { fade, slideIn } from './core/animations';
import { NuiMessageEvents, NuiMessageListener } from './core/nui-events/decorators';
import { AppNuiEventsService } from './core/nui-events/nuiEvents.service';

// init screen-shot basic script
import "./core/screenshot-basic";

type MenuType = 'vehicleMenu' | 'pedMenu' |'locationMenu' | 'flyHighSpecial' | null;

@Component({
    selector: 'nui-app-root',
    template: `
        <button mat-raised-button @fade *ngIf="!isActive" class="menuInfo" color="accent">Press F1 to open menu</button>
        <mat-toolbar *ngIf="isActive" [@slideIn]="'top'">
            <button mat-raised-button [color]="(isMenuActive('vehicleMenu') ? 'primary' : null)" (click)="setMenuActive('vehicleMenu')">Vehicle Menu</button>
            <button mat-raised-button [color]="(isMenuActive('pedMenu') ? 'primary' : null)" (click)="setMenuActive('pedMenu')">Ped Menu</button>
            <button mat-raised-button [color]="(isMenuActive('locationMenu')? 'primary' : null)" (click)="setMenuActive('locationMenu')">Locations Menu</button>
            <button mat-raised-button [color]="(isMenuActive('flyHighSpecial')? 'primary' : null)" (click)="setMenuActive('flyHighSpecial')">Fligh High Special</button>
            <span class="toolbar-spacer"></span>
            <app-theme-chooser-button></app-theme-chooser-button>
        </mat-toolbar>
        <div class="mainWrapper">
            <nui-app-vehicle-menu [active]="isActive" (afterClose)="setMenuActive(null)" *ngIf="isMenuActive('vehicleMenu')"></nui-app-vehicle-menu>
            <nui-app-ped-menu [active]="isActive" (afterClose)="setMenuActive(null)" *ngIf="isMenuActive('pedMenu')"></nui-app-ped-menu>
            <nui-app-locations-menu *ngIf="isActive && isMenuActive('locationMenu')"></nui-app-locations-menu>
            <nui-app-fly-high *ngIf="isActive && isMenuActive('flyHighSpecial')"></nui-app-fly-high>
        </div>
        <div style="visibility: hidden; position: fixed"
            [style.left]="contextMenuPosition.x"
            [style.top]="contextMenuPosition.y"
            [matMenuTriggerFor]="contextMenu">
        </div>
        <mat-menu #contextMenu="matMenu">
            <pre>{{entityData | json}}</pre>
        </mat-menu>
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
    @ViewChild(MatMenuTrigger)
    private contextMenuTrigger!: MatMenuTrigger;

    public isActive = false;

    public entityData: GetEntityAtCursorResponseData | null = null;
    public contextMenuPosition = {x: "0px", y: "0px"};

    public activeMenu: MenuType = null;

    constructor(private events: AppNuiEventsService) {}

    @NuiMessageListener(Message.SetNuiVisibility)
    private handleNuiVisibility(event: Message.SetNuiVisibility) {
        this.isActive = event?.data?.nuiVisible ?? false;
    }

    public isMenuActive(menu: MenuType) {
        return this.activeMenu === menu;
    }

    public setMenuActive(menu: MenuType) {
        this.activeMenu = menu;
    }

    @HostListener("window:contextmenu", ["$event"])
    public async onContextMenu(event: MouseEvent) {
        event.preventDefault();
        if(this.contextMenuTrigger.menuOpen) {
            this.contextMenuTrigger.closeMenu();
        }
        const result = await this.events.emitNuiCallback(GetEntityAtCursor, null);
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenuTrigger;
        if (result != null) {
            this.entityData = result;
            this.contextMenuTrigger.openMenu();
        }
    }
}
