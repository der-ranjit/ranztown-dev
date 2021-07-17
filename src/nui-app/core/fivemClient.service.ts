import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({providedIn: "root"})
export class FiveMClientService {
    // get parent resource name by call to GetParentResourceName()
    private parentResourceName = "testmenu";

    /* cache observables created for events */
    private eventObservables = new Map<string, Observable<any>>();

    public constructor(private snackBar: MatSnackBar) {
        this.initListeningToClientEvents();
    }

    public async invoke(eventName: string, data: any): Promise<any>{
        const result = await fetch(`https://${this.parentResourceName}/${eventName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(data)
        });
        return result.json();
    }

    public getEventObservable(eventName: string): Observable<any> {
        if (!this.eventObservables.has(eventName)) {
            const observable = fromEvent(window, "message").pipe(filter(event => event.type === eventName));
            this.eventObservables.set(eventName, observable)
        }
        return this.eventObservables.get(eventName)!;
    }


    private initListeningToClientEvents(): void {
        window.addEventListener("message", event => {
            if (event.data.type === 'notification') {
                const snackbar = this.snackBar.open(event.data.message, 'Ok');
                setTimeout(() => {
                    snackbar.dismiss();
                },2000)
            }
        });
    }
}
