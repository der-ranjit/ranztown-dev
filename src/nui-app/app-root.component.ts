import { Component } from '@angular/core';
import { Message } from '../shared/nui-events';
import { fade } from './core/animations';
import { NuiMessageEvents, NuiMessageListener } from './core/nui-events/decorators';

@Component({
    selector: 'nui-app-root',
    template: `
        <button mat-raised-button @fade *ngIf="!isActive" class="menuInfo" color="accent">Press menu-key (M) to open menu</button>
        <div class="mainWrapper">
            <nui-app-vehicle-menu @fade *ngIf="isActive" cdkDrag></nui-app-vehicle-menu>
        </div>
    `,
    styles: [`
        :host, .mainWrapper {
            display: flex;
            flex: 1;
            height: 100%;
            max-height: 100%;
            overflow: hidden;
            opacity: .85;
        }
        .menuInfo {
            position: absolute;
            left: 10px;
            top: 10px;
            opacity: 0.8;
        }
        nui-app-vehicle-menu {
            max-height: 800px;
            max-width: 300px;
        }
    `],
    animations: [
        fade
    ]
})
@NuiMessageEvents
export class AppRootComponent {
    public isActive = false;

    @NuiMessageListener(Message.setNuiVisibility)
    private handleNuiVisibility(data: Message.setNuiVisibilityData) {
        this.isActive = data?.nuiVisible ?? false;
    }
}
