import { AnimationEvent } from '@angular/animations';
import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Peds } from 'src/shared/Peds';

import { Callback } from '../../shared/nui-events';
import { slideIn } from '../core/animations';
import { AppNuiEventsService } from '../core/nui-events/nuiEvents.service';

@Component({
    selector: 'nui-app-ped-menu',
    template: `
        <div class="pedListContainer" *ngIf="active" [@slideIn]="'left'" (@slideIn.done)="onCloseAnimationDone($event)">
            <app-virtual-filter-list #scroll
                [items]="pedsNames"
                [filterLabel]="'ped name'"
                [filterDescription]="'press enter or click to spawn'"
                (onEnter)="handleSpawn(scroll.currentFilterValue)">
                <div *ngFor="let name of scroll.filteredViewportItems" class="virtualFilterItem"
                    [style.backgroundColor]="'blue'"
                    (click)="handleSpawn(name)">
                    <div class="pedName">{{name}}</div>
                </div>
            </app-virtual-filter-list>
        </div>
`,
    styles: [`
        :host {
            display: flex;
            flex: 1;
            flex-direction: column;
            max-width: 300px;
            overflow: hidden;
        }
        .pedListContainer {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background-color: var(--background-color);
        }
        .pedName {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -3px;
            display: flex;
            justify-content: center;
            color: black
        }

    `],
    animations: [
        slideIn
    ]
})
export class PedMenuComponent {
    @Input()
    public active = false;

    @Output()
    public afterClose = new Subject();

    // TODO large list loads too long
    public pedsNames = [...Object.values(Peds)].map(ped => ped.name).sort();

    constructor(private events: AppNuiEventsService) {
    }

    public handleSpawn(pedModel: string): void {
        this.events.emitNuiCallback(Callback.ChangePed, { ped: pedModel });
    }

    public onCloseAnimationDone(event: AnimationEvent) {
        if (event.toState === 'void') {
            this.afterClose.next();
        }
    }
}
