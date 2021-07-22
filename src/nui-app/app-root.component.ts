import { Component } from '@angular/core';
import { FlyHigh } from 'src/shared/nui-events/callbacks';
import { Message } from '../shared/nui-events';
import { fade } from './core/animations';
import { NuiMessageEvents, NuiMessageListener } from './core/nui-events/decorators';
import { AppNuiEventsService } from './core/nui-events/nuiEvents.service';

@Component({
    selector: 'nui-app-root',
    template: `
        <button mat-raised-button @fade *ngIf="!isActive" class="menuInfo" color="accent">Press F1 to open menu</button>
        <div class="mainWrapper">
            <nui-app-vehicle-menu *ngIf="isActive"></nui-app-vehicle-menu>
            <button mat-raised-button *ngIf="isActive" @fade color="warn" (click)="flyHigh()">Press F3 to fly high</button>
        </div>
    `,
    styles: [`
        :host, .mainWrapper {
            display: flex;
            flex: 1;
            height: 100%;
            max-height: 100%;
            overflow: hidden;
            opacity: .9;
        }
        .menuInfo {
            position: absolute;
            left: 10px;
            top: 10px;
            opacity: 0.8;
        }
    `],
    animations: [
        fade
    ]
})
@NuiMessageEvents
export class AppRootComponent {
    public isActive = false;

    constructor(private events: AppNuiEventsService) {}

    @NuiMessageListener(Message.SetNuiVisibility)
    private handleNuiVisibility(event: Message.SetNuiVisibility) {
        this.isActive = event?.data?.nuiVisible ?? false;
    }

    public flyHigh() {
        this.events.emitNuiCallback(FlyHigh, null);
    }
}
