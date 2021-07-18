import { Component } from '@angular/core';
import { CfxEventsService } from './core/cfxEvents.service';

@Component({
    selector: 'nui-app-root',
    template: `
        <nui-app-vehicle-menu></nui-app-vehicle-menu>
    `,
    styles: [`
        :host {
            display: flex;
            flex: 1;
            max-height: 100%;
            overflow: hidden;
        }

        nui-app-vehicle-menu {
            max-height: 600px;
            max-width: 800px;
        }
    `]
})
export class AppRootComponent {
    constructor(private events: CfxEventsService) {
    }
}
