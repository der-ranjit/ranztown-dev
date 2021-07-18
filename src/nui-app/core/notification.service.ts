import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { Events } from "../../shared/events";

import { FiveMClientService } from "./fivemClient.service";

export const notificationTimeoutMS = 3000;

@Injectable({providedIn: "root"})
export class NotificationService {
    private notifications$: Observable<Events.Notification>;

    public constructor(private snackBar: MatSnackBar, private fivemClient: FiveMClientService) {
        this.notifications$ = this.fivemClient.getEventObservable(Events.Notification);
        this.notifications$.subscribe(action => {
            const snackbar = this.snackBar.open(action.data?.message ?? "?? NO MESSAGE ??", 'Ok');
            setTimeout(() => snackbar.dismiss(), notificationTimeoutMS);
        })
    }
}
