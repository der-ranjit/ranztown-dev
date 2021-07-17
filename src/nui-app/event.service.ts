import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class EventService {
    public constructor() {
        window.addEventListener("message", event => {
            let item = event.data;

            if (item.type === "TOGGLE_NUI") {
                console.log("toggle received");
            }
        });
    }
}
