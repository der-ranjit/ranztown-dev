import { Component } from '@angular/core';
import { Message } from '../shared/nui-events';
import { fade, slideIn } from './core/animations';
import { NuiMessageEvents, NuiMessageListener } from './core/nui-events/decorators';

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
        <app-entity-context-menu></app-entity-context-menu>

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
    public isActive = false;
    public activeMenu: MenuType = null;

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
}
