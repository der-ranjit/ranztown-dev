import { Component } from '@angular/core';
import { Message } from '../shared/nui-events';
import { fade } from './core/animations';
import { NuiMessageEvents, NuiMessageListener } from './core/nui-events/decorators';

type MenuType = 'vehicleMenu' | 'locationMenu' | 'flyHighSpecial' | null;

@Component({
    selector: 'nui-app-root',
    template: `
        <button mat-raised-button @fade *ngIf="!isActive" class="menuInfo" color="accent">Press F1 to open menu</button>
        <mat-toolbar *ngIf="isActive" @fade>
            <button mat-raised-button [color]="(isMenuActive('vehicleMenu') ? 'primary' : null)" (click)="setMenuActive('vehicleMenu')">Vehicle Menu</button>
            <button mat-raised-button [color]="(isMenuActive('locationMenu')? 'primary' : null)" (click)="setMenuActive('locationMenu')">Locations Menu</button>
            <button mat-raised-button [color]="(isMenuActive('flyHighSpecial')? 'primary' : null)" (click)="setMenuActive('flyHighSpecial')">Fligh High Special</button>
        </mat-toolbar>
        <div class="mainWrapper">
            <nui-app-vehicle-menu *ngIf="isMenuActive('vehicleMenu')"></nui-app-vehicle-menu>
            <nui-app-locations-menu *ngIf="isMenuActive('locationMenu')"></nui-app-locations-menu>
            <nui-app-fly-high *ngIf="isMenuActive('flyHighSpecial')"></nui-app-fly-high>
        </div>
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            flex: 1;
            height: 100%;
            max-height: 100%;
            opacity: .9;
        }
        .mainWrapper {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
        }
        .menuInfo {
            position: absolute;
            left: 10px;
            top: 10px;
            opacity: 0.8;
        }

        mat-toolbar button {
            margin: 0 4px;
        }
    `],
    animations: [
        fade
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
        return this.isActive && this.activeMenu === menu;   
    }

    public setMenuActive(menu: MenuType) {
        this.activeMenu = menu;
    }
}
