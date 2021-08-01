import { Injectable } from "@angular/core";
import { GetFileServerBaseUrl } from "../../../shared/nui-events/callbacks";
import { AppNuiEventsService } from "./nui-events/nuiEvents.service";

@Injectable({providedIn: "root"})
export class FileUrlResolver {
    public fileServerBaseUrl!: string
    constructor(private events: AppNuiEventsService) {
        this.setFileServerBaseUrl();
    }

    public resolve(filePath: string): string {
        return `${this.fileServerBaseUrl}/${filePath}`;
    }

    private async setFileServerBaseUrl(): Promise<void> {
        const result = await this.events.emitNuiCallback(GetFileServerBaseUrl, null);
        this.fileServerBaseUrl = result.baseUrl;
    }
}
