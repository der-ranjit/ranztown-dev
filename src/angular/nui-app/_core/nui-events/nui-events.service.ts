import { fromEvent, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { Callback, Message } from "../../../../angular-fivem-shared/nui-events";

declare var RESOURCE_NAME: string;

export class AppNuiEventsService {
    private static INSTANCE: AppNuiEventsService | null = null;
    public static getInstance(): AppNuiEventsService {
        if (!AppNuiEventsService.INSTANCE) {
            AppNuiEventsService.INSTANCE = new AppNuiEventsService;
        }
        return AppNuiEventsService.INSTANCE;
    }

    /* cache observables created for events */
    protected cachedObservables = new Map<string, Observable<any>>();

    public async emitNuiCallback<R, D, T extends Callback.AbstractCallback<D,R>>(
        eventType: Callback.CallbackConstructor<T, D, R>,
        data: D | null
    ): Promise<R>{
        const result = await fetch(`https://${RESOURCE_NAME}/${eventType.name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: data != null ? JSON.stringify(data) : null
        });
        return result.json();
    }

    public getObservableForNuiMessage<D, T extends Message.AbstractMessage<D>>(eventType: Message.MessageConstructor<T, D>): Observable<T> {
        const eventName = eventType.name;
        if (!this.cachedObservables.has(eventName)) {
            const observable = fromEvent(window, "message").pipe(
                filter((messageEvent: any) => messageEvent.data.type === eventName),
                map(messageEvent => ({
                    name: eventName,
                    data: messageEvent.data.data
                }))
            );
            this.cachedObservables.set(eventName, observable)
        }
        return this.cachedObservables.get(eventName)!;
    }
}

// class Nui {
//     onClientNuiEvent(data: any) {}
//     emitNuiEvent(data: any, responseCallback: Function) {}

//     test() {
//         this.emitNuiEvent({name: "setWeather"}, () => {});
//         this.onClientNuiEvent("weather changed" /* update ui */);
//     }
// }

// class Client {
//     /* listens to same client; wird nich gebraucht, client spricht direkt mit sich selbst */
//     // onClientEvent(data: any) {}
//     /* emit to same client; wird nich gebraucht, client spricht direkt mit sich selbst */
//     // emitClientEvent(data: any) {}

//     onNuiEvent(data: any, responceCallback: Function) {}
//     emitClientNuiEvent(data: any) {}
//     /* listens to same client and server */
//     onNetEvent(data: any) {}
//     /* emits to server */
//     emitNetEvent(source: any, data: any) {}

//     test() {
//         this.onNuiEvent({name: "setWeather"}, () => {
//             this.emitNetEvent("", "setWeather")
//         })
//         this.onNetEvent("weather changed");
//             this.emitClientNuiEvent("weather changed");
//     }
// }

// class Server {
//     /* emit to same server; wird nich gebraucht, server spricht direkt mit sich selbst */
//     // emitEvent(data: any) {}
//     /* listens to same server; wird nich gebraucht, server spricht direkt mit sich selbst */
//     // onEvent(data: any) {}
//     // emits to server and target (-1 all clients, or specific client)
//     emitNet(target: any, data: any) {}
//     // listens to all clients and server events
//     onNet(source: any, data: any) {}

//     test() {
//         this.onNet("setWeather", "settin weather");
//         this.emitNet("weather changed", "");
//     }
// }
