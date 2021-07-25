import { Component, OnInit } from "@angular/core";
import { GetCurrentPlayerPosition, GetUserLocations, MovePlayerToLocation, SaveUserLocation } from "../../shared/nui-events/callbacks";
import { UserLocationsUpdate } from "../../shared/nui-events/messages";
import { UserSavedLocation } from "../../shared/storage/UserSavedLocation";
import { NuiMessageEvents, NuiMessageListener } from "../core/nui-events/decorators";
import { AppNuiEventsService } from "../core/nui-events/nuiEvents.service";

@Component({
    selector: "nui-app-locations-menu",
    template: `
        <button mat-raised-button color="warn" (click)="saveCurrentUserLocation()">Save current</button>
        <div class="locations">
            <div *ngFor="let location of locations" (click)="onLocationClick(location)">{{location | json }}>
        </div>
    `,
    styles: [`
    .locations {
        display: flex;
        width: 500px;
        height: 500px;
        background-color: white;
        flex-direction: column;
        overflow: auto;
    }`]
})
@NuiMessageEvents
export class LocationsMenuComponent implements OnInit {
    public locations: UserSavedLocation[] = [];

    constructor(private events: AppNuiEventsService) {}

    public ngOnInit() {
        this.requestUpdateUserLocations();
    }

    @NuiMessageListener(UserLocationsUpdate)
    private onUserLocationsUpdate(event: UserLocationsUpdate) {
        this.locations = event.data.locations;
    }


    private async requestUpdateUserLocations() {
        const userLocations = await this.events.emitNuiCallback(GetUserLocations, null);
    }

    public onLocationClick(location: UserSavedLocation) {
        this.events.emitNuiCallback(MovePlayerToLocation, { location });
    }

    public async saveCurrentUserLocation() {
        const playerPosition = await this.events.emitNuiCallback(GetCurrentPlayerPosition, null);
        const location = {
            userId: "-1",
            description: "cool location",
            locationName: "new",
            previewFilePath: "none",
            ...playerPosition
        }
        const result = await this.events.emitNuiCallback(SaveUserLocation, { location });
    }
}
