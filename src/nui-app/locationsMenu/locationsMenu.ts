import { Component, OnInit } from "@angular/core";
import { GetCurrentPlayerPosition, GetUserLocations, MovePlayerToLocation, SaveUserLocation } from "../../shared/nui-events/callbacks";
import { UserLocationsUpdate } from "../../shared/nui-events/messages";
import { UserSavedLocation } from "../../shared/storage/UserSavedLocation";
import { NuiMessageEvents, NuiMessageListener } from "../core/nui-events/decorators";
import { AppNuiEventsService } from "../core/nui-events/nuiEvents.service";

@Component({
    selector: "nui-app-locations-menu",
    template: `
        <div class="locationsMenu">
            <button mat-raised-button color="accent" (click)="saveCurrentUserLocation()">Save current</button>
            <div class="locations">
                <div *ngFor="let location of locations" (click)="onLocationClick(location)">{{location | json }}
            </div>
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
        .locationsMenu {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            max-width: 300px;
            background-color: #424242;
            padding-bottom: 8px;

            button {
                margin: 8px;
            }
        }
        .locations {
            background-color: #616161;
            display: flex;
            flex: 1;
            flex-wrap: wrap;
            justify-content: space-around;
            overflow-y: auto;
            margin: 0 8px;
            padding: 8px;
            border-radius: 4px;
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


    private requestUpdateUserLocations() {
        this.events.emitNuiCallback(GetUserLocations, null);
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
