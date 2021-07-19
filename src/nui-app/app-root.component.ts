import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Events } from '../shared/events';
import { CfxEventsService } from './core/cfxEvents.service';

@Component({
    selector: 'nui-app-root',
    template: `
        <button mat-raised-button @fade *ngIf="!isActive" class="menuInfo" color="accent">Press 'M' to open menu</button>
        <div class="mainWrapper">
            <nui-app-vehicle-menu @fade *ngIf="isActive"></nui-app-vehicle-menu>
        </div>
    `,
    styles: [`
        :host, .mainWrapper {
            display: flex;
            flex: 1;
            max-height: 100%;
            overflow: hidden;
        }

        .menuInfo {
            position: absolute;
            left: 10px;
            top: 10px;
            opacity: 0.8;
        }
        nui-app-vehicle-menu {
            max-height: 600px;
            max-width: 800px;
        }
    `],
    animations: [
        trigger('fade', [
            transition('void => *', [
              style({opacity: 0}),
              animate(300, style({opacity: 1}))
            ]),
            transition('* => void', [
              animate(300, style({opacity: 0}))
            ])
          ])
    ]
})
export class AppRootComponent implements OnInit {
    public isActive = false;
    constructor(private events: CfxEventsService) {
    }

    public ngOnInit(): void {
        this.events.on(Events.setNuiVisibility).subscribe(event => this.isActive = event.data?.nuiVisible ?? false)
    }
}
