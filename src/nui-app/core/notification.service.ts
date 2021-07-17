import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { FiveMClientService } from "./fivemClient.service";

export const notificationTimeoutMS = 3000;

@Injectable({providedIn: "root"})
export class NotificationService {
    private notifications$: Observable<any>;

    public constructor(private snackBar: MatSnackBar, private fivemClient: FiveMClientService) {
        this.notifications$ = this.fivemClient.getEventObservable("notification");
        this.notifications$.subscribe(event => {
            const snackbar = this.snackBar.open(event.data.message, 'Ok');
            setTimeout(() => snackbar.dismiss(), notificationTimeoutMS);
        })
    }
}
