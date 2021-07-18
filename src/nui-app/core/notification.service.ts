import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";

import { FiveMClientService } from "./fivemClient.service";
import * as NuiActions from "src/actions/nui.actions";

export const notificationTimeoutMS = 3000;

@Injectable({providedIn: "root"})
export class NotificationService {
    private notifications$: Observable<NuiActions.Notification>;

    public constructor(private snackBar: MatSnackBar, private fivemClient: FiveMClientService) {
        this.notifications$ = this.fivemClient.getEventObservable<NuiActions.Notification>("notification");
        this.notifications$.subscribe(action => {
            const snackbar = this.snackBar.open(action.data.message, 'Ok');
            setTimeout(() => snackbar.dismiss(), notificationTimeoutMS);
        })
    }
}
