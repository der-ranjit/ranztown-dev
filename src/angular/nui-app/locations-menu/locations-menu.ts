import { AnimationEvent } from "@angular/animations";
import { Component, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Vec3 } from "fivem-js/lib/utils/Vector3";
import { BehaviorSubject, Subject } from "rxjs";

import { UserSavedLocation } from "../../../angular-fivem-shared/serialization/UserSavedLocation";
import { VirtualFilterListComponent } from "../_core/virtual-filter-list";
import { slideIn } from "../_core/animations";
import { FileUrlResolver } from "../_core/file-url-resolver";
import { NuiMessageEvents, NuiMessageListener } from "../_core/nui-events/decorators";
import { AppNuiEventsService } from "../_core/nui-events/nui-events.service";
import { NuiCB } from "../../../angular-fivem-shared/nui-events/callbacks";
import { Nui } from "../../../angular-fivem-shared/nui-events/messages";

@Component({
    selector: "nui-app-locations-menu",
    template: `
        <div class="locationsMenu" [@slideIn]="'left'" *ngIf="active" (@slideIn.done)="onCloseAnimationDone($event)">
            <div *ngIf="isAdmin">
                <input type="number" #x>
                <input type="number" #y>
                <input type="number" #z>
                <button (click)="teleport(x.value, y.value, z.value)"> tp </button>
            </div>
            <button mat-raised-button
                [disabled]="!isLocationNameValid(scroll.currentFilterValue)"
                (click)="saveCurrentUserLocation()">Save current</button>
            <app-virtual-filter-list #scroll
                [items]="(locations$ | async)!"
                [filterKey]="'locationName'"
                [filterLabel]="'location name'">
                <div *ngFor="let location of scroll.filteredViewportItems" class="virtualFilterItem"
                    [style.backgroundImage]="getLocationBackgroundUrl(location)"
                    (click)="onLocationClick(location)">
                    {{location.locationName}}
                </div>
            </app-virtual-filter-list>
        </div>
    `,
    styles: [`
        .locationsMenu {
            display: flex;
            flex: 1;
            flex-direction: column;
            overflow: hidden;
            max-width: 300px;
            background-color: var(--background-color);

            button {
                margin: 8px;
            }
        }
    `],
    animations: [
        slideIn
    ]
})
@NuiMessageEvents
export class LocationsMenuComponent implements OnInit {
    @Input()
    public active = false;

    @Output()
    public afterClose = new Subject();

    @ViewChild("scroll")
    private virtualFilterList!: VirtualFilterListComponent;

    public locations$ = new BehaviorSubject<UserSavedLocation[]>([]);
    public currentPlayerLocation: Vec3 = {x:0, y:0, z:0};

    public isAdmin = false;
    constructor(
        private events: AppNuiEventsService,
        private fileUrlResolver: FileUrlResolver
    ) {}

    public async ngOnInit() {
        this.requestUpdateUserLocations();
        this.isAdmin = (await this.events.emitNuiCallback(NuiCB.AdminTools.IsAdmin, null)).isAdmin;
    }

    @NuiMessageListener(Nui.Locations.UserLocationsUpdate)
    private onUserLocationsUpdate(event: Nui.Locations.UserLocationsUpdate) {
        setTimeout(() => this.locations$.next(event.data.locations), 0)
    }


    private requestUpdateUserLocations() {
        this.events.emitNuiCallback(NuiCB.Locations.GetUserLocations, null);
    }

    public onLocationClick(location: UserSavedLocation) {
        this.events.emitNuiCallback(NuiCB.Locations.MovePlayerToLocation, { location });
    }

    public teleport(x: string, y: string, z: string) {
        const coords = {
            x: parseInt(x),
            y: parseInt(y),
            z: parseInt(z),
         };
        this.events.emitNuiCallback(NuiCB.Locations.MovePlayerToCoords, { coords } );
    }

    public isLocationNameValid(locationName: string): boolean {
        return locationName !== ""
            // only allow letter, numbers, underlines and hyphens
            // TODO fix spaces; \s
            && !locationName.match(/[^a-zA-Z\d_-]/gi)?.length
            && this.locations$.getValue().findIndex(location => location.locationName === locationName) === -1;
    }

    public getLocationBackgroundUrl(location: UserSavedLocation): string {
        const fileUrl = this.fileUrlResolver.resolve(location.previewFilePath);
        return `url(${fileUrl})`;
    }

    public async saveCurrentUserLocation() {
        const playerPosition = await this.events.emitNuiCallback(NuiCB.Locations.GetCurrentPlayerPosition, null);
        const location = {
            // will be set correctly by server
            userId: "-1",
            description: "cool location",
            locationName: this.virtualFilterList.currentFilterValue,
            // will be set correctly by server
            previewFilePath: "none",
            ...playerPosition
        }
        const result = await this.events.emitNuiCallback(NuiCB.Locations.SaveUserLocation, { location });
    }

    public onCloseAnimationDone(event: AnimationEvent) {
        if (event.toState === 'void') {
            this.afterClose.next();
        }
    }
}
