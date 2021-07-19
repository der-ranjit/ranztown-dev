import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { Events } from "../../shared/events";

import { CfxEventsService } from "./cfxEvents.service";

export const notificationTimeoutMS = 6000;

@Injectable({providedIn: "root"})
export class NotificationService {
    private notifications$: Observable<Events.Notification>;

    public constructor(
        private snackBar: MatSnackBar,
        private events: CfxEventsService
    ) {
        this.notifications$ = this.events.on(Events.Notification);
        this.notifications$.subscribe(action => {
            const snackbar = this.snackBar.open(action.data?.message ?? "?? NO MESSAGE ??", 'Ok');
            setTimeout(() => snackbar.dismiss(), notificationTimeoutMS);
        })
    }
}
