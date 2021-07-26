import { Component, OnInit } from "@angular/core";
import { GetCurrentPlayerPosition, GetUserLocations, MovePlayerToLocation, SaveUserLocation } from "../../shared/nui-events/callbacks";
import { UserLocationsUpdate } from "../../shared/nui-events/messages";
import { UserSavedLocation } from "../../shared/storage/UserSavedLocation";
import { FileUrlResolver } from "../core/fileUrlResolver";
import { NuiMessageEvents, NuiMessageListener } from "../core/nui-events/decorators";
import { AppNuiEventsService } from "../core/nui-events/nuiEvents.service";

@Component({
    selector: "nui-app-locations-menu",
    template: `
        <div class="locationsMenu">
            <input type="text" #locationName [(ngModel)]="locationNameInput"
                exclusiveInput>
            <button mat-raised-button color="accent"
                [disabled]="!isLocationInputNameValid()"
                (click)="saveCurrentUserLocation()">Save current</button>
            <div class="locations">
                <div *ngFor="let location of locations" class="location"
                    [style.backgroundImage]="getLocationBackgroundUrl(location)"
                    (click)="onLocationClick(location)">
                {{location.locationName}}
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
        }
        .location {
            position: relative;
            width: 120px;
            height: 100px;
            margin-top: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            border-radius: 5px;
            background-size: contain;
            background-repeat: no-repeat;
            background-color: white;
            background-position: center;
        }
    `]
})
@NuiMessageEvents
export class LocationsMenuComponent implements OnInit {
    public locations: UserSavedLocation[] = [];

    public locationNameInput = "";

    constructor(
        private events: AppNuiEventsService,
        private fileUrlResolve: FileUrlResolver
    ) {}

    public ngOnInit() {
        this.requestUpdateUserLocations();
    }

    @NuiMessageListener(UserLocationsUpdate)
    private onUserLocationsUpdate(event: UserLocationsUpdate) {
        this.locations = []
        setTimeout(() => this.locations = event.data.locations, 0)
    }


    private requestUpdateUserLocations() {
        this.events.emitNuiCallback(GetUserLocations, null);
    }

    public onLocationClick(location: UserSavedLocation) {
        this.events.emitNuiCallback(MovePlayerToLocation, { location });
    }

    public isLocationInputNameValid(): boolean {
        return this.locationNameInput !== ""
            && this.locations.findIndex(location => location.locationName == this.locationNameInput) === -1;
    }

    public getLocationBackgroundUrl(location: UserSavedLocation): string {
        const fileUrl = this.fileUrlResolve.resolve(location.previewFilePath);
        return `url(${fileUrl})`;
    }

    public async saveCurrentUserLocation() {
        const playerPosition = await this.events.emitNuiCallback(GetCurrentPlayerPosition, null);
        const location = {
            userId: "-1",
            description: "cool location",
            locationName: this.locationNameInput,
            previewFilePath: "none",
            ...playerPosition
        }
        const result = await this.events.emitNuiCallback(SaveUserLocation, { location });
    }
}
