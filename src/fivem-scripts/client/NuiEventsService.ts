import { Observable, Observer } from "rxjs";
import { map} from "rxjs/operators";

import { Callback, Message } from "../../shared/nui-events";
import { CallbackConstructorType } from "../../shared/nui-events/callbacks";
import { MessageConstructorType } from "../../shared/nui-events/messages";
import { getEventName } from "../../shared/nui-events/utils";

type NuiCallbackType = { data: any, cb: Function };

export class CfxNuiEventsService {
    private static instance: CfxNuiEventsService | null = null;
    public static getInstance(): CfxNuiEventsService {
        if (!CfxNuiEventsService.instance) {
            CfxNuiEventsService.instance = new CfxNuiEventsService();
        }
        return CfxNuiEventsService.instance;
    }

    private cachedObservables = new Map<string, Observable<any>>()

    public emitNuiMessage<D, T extends Message.AbstractMessage<D>>(
        eventType: MessageConstructorType<T,D>,
        data: D | null
    ): Promise<D | null> {
        SendNuiMessage(JSON.stringify({ type: getEventName(eventType), data }))
        return Promise.resolve(null);
    }

    public onNuiCallback<R, D, T extends Callback.AbstractCallback<D, R>>(
        eventType: CallbackConstructorType<T,D,R>
    ): Observable<T> {
        const eventName = getEventName(eventType);
        if (!this.cachedObservables.has(eventName)) {
            RegisterNuiCallbackType(eventName);
            const nuiObservable = this.createObservableFromNuiCallback(eventName).pipe(
                // create object of type Callback
                map(_event => ({name: eventName, data: _event.data, cb: _event.cb}))
            );
            this.cachedObservables.set(eventName, nuiObservable)
        }
        return this.cachedObservables.get(eventName)!;
    };

    private createObservableFromNuiCallback(eventName: string): Observable<NuiCallbackType> {
        return new Observable((observer: Observer<NuiCallbackType>) => {
            on(`__cfx_nui:${eventName}`, (data: any, cb: Function) => {
                observer.next({data, cb})
            });
        });
    }
}
