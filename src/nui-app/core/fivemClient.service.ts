import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn: "root"})
export class FiveMClientService {
    // get parent resource name by call to GetParentResourceName()
    private parentResourceName = "testmenu";

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

    private initListeningToClientEvents(): void {
        window.addEventListener("message", event => {
            if (event.data.type === 'notification') {
                this.snackBar.open(event.data.message, 'Ok');
            }
        });
    }
}
