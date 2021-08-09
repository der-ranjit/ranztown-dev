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
