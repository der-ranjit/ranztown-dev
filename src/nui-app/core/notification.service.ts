import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Message } from "../../shared/nui-events";
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
    }

    @NuiMessageListener(Message.Notification)
    private handleNotification(data: Message.NotificationData): void {
        const snackbar = this.snackBar.open(data?.message ?? "?? NO MESSAGE ??", 'Ok');
        setTimeout(() => snackbar.dismiss(), notificationTimeoutMS);
    }
}
