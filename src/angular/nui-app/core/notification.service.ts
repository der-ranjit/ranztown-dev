import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Message } from "../../../shared/nui-events";
import { BaseNuiService } from "./nui-events/base.service";
import { NuiMessageEvents, NuiMessageListener } from "./nui-events/decorators";

export const notificationTimeoutMS = 6000;

@Injectable({providedIn: "root"})
@NuiMessageEvents
export class NotificationService extends BaseNuiService {
    public constructor(
        private snackBar: MatSnackBar,
    ) {
        super();
        const snackbar = this.snackBar.open("Resource restarted", 'Ok');
        setTimeout(() => snackbar.dismiss(), 10000);
    }

    @NuiMessageListener(Message.Notification)
    private handleNotification(event: Message.Notification): void {
        const snackbar = this.snackBar.open(event?.data?.message ?? "?? NO MESSAGE ??", 'Ok');
        setTimeout(() => snackbar.dismiss(), notificationTimeoutMS);
    }
}
