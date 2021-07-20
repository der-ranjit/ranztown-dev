import { fromEvent, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { Callback, Message } from "../../../shared/nui-events";
import { getEventNameFromEventType } from "../../../shared/nui-events/utils";

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
    // get parent resource name by call to GetParentResourceName()
    private parentResourceName = "testmenu";

    public async emitNuiCallback<R, D, T extends Callback.AbstractCallback<D,R>>(
        eventType: Callback.CallbackConstructor<T, D, R>,
        data: D | null
    ): Promise<R>{
        const result = await fetch(`https://${this.parentResourceName}/${getEventNameFromEventType(eventType)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: data != null ? JSON.stringify(data) : null
        });
        return result.json();
    }

    public getObservableForNuiMessage<D, T extends Message.AbstractMessage<D>>(eventType: Message.MessageConstructor<T, D>): Observable<T> {
        const eventName = getEventNameFromEventType(eventType);
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
