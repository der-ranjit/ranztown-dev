import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class FiveMClientService {
    // get parent resource name by call to GetParentResourceName()
    private parentResourceName = "testmenu";

    public constructor() {
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
            console.log(event);
        });
    }
}
