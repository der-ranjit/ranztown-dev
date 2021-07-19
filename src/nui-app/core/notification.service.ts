import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Events } from "../../shared/events";

import { AppNuiEventsService } from "./nuiEvents.service";

export const notificationTimeoutMS = 6000;

@Injectable({providedIn: "root"})
export class NotificationService {
    public constructor(
        private snackBar: MatSnackBar,
        private events: AppNuiEventsService
    ) {
        this.events.onNuiMessage(Events.Notification).subscribe(this.handleNotification.bind(this))
    }

    private handleNotification(notification: Events.Notification): void {
        const snackbar = this.snackBar.open(notification.data?.message ?? "?? NO MESSAGE ??", 'Ok');
        setTimeout(() => snackbar.dismiss(), notificationTimeoutMS);
    }
}
