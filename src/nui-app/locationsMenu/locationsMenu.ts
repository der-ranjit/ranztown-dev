import { Component, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { GetCurrentPlayerPosition, GetUserLocations, MovePlayerToLocation, SaveUserLocation } from "../../shared/nui-events/callbacks";
import { UserLocationsUpdate } from "../../shared/nui-events/messages";
import { UserSavedLocation } from "../../shared/storage/UserSavedLocation";
import { VirtualFilterListComponent } from "../common/virtualFilterList";
import { FileUrlResolver } from "../core/fileUrlResolver";
import { NuiMessageEvents, NuiMessageListener } from "../core/nui-events/decorators";
import { AppNuiEventsService } from "../core/nui-events/nuiEvents.service";

@Component({
    selector: "nui-app-locations-menu",
    template: `
        <div class="locationsMenu">
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
    `]
})
@NuiMessageEvents
export class LocationsMenuComponent implements OnInit {
    @ViewChild("scroll")
    private virtualFilterList!: VirtualFilterListComponent;

    public locations$ = new BehaviorSubject<UserSavedLocation[]>([]);

    constructor(
        private events: AppNuiEventsService,
        private fileUrlResolver: FileUrlResolver
    ) {}

    public ngOnInit() {
        this.requestUpdateUserLocations();
    }

    @NuiMessageListener(UserLocationsUpdate)
    private onUserLocationsUpdate(event: UserLocationsUpdate) {
        setTimeout(() => this.locations$.next(event.data.locations), 0)
    }


    private requestUpdateUserLocations() {
        this.events.emitNuiCallback(GetUserLocations, null);
    }

    public onLocationClick(location: UserSavedLocation) {
        this.events.emitNuiCallback(MovePlayerToLocation, { location });
    }

    public isLocationNameValid(locationName: string): boolean {
        return locationName !== ""
            && this.locations$.getValue().findIndex(location => location.locationName === locationName) === -1;
    }

    public getLocationBackgroundUrl(location: UserSavedLocation): string {
        const fileUrl = this.fileUrlResolver.resolve(location.previewFilePath);
        return `url(${fileUrl})`;
    }

    public async saveCurrentUserLocation() {
        const playerPosition = await this.events.emitNuiCallback(GetCurrentPlayerPosition, null);
        const location = {
            // will be set correctly by server
            userId: "-1",
            description: "cool location",
            locationName: this.virtualFilterList.currentFilterValue,
            // will be set correctly by server
            previewFilePath: "none",
            ...playerPosition
        }
        const result = await this.events.emitNuiCallback(SaveUserLocation, { location });
    }
}
