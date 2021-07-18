import * as Cfx from "fivem-js";
import { fromEvent, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { Events } from "../../shared/events";
import { EventsService } from "../../shared/events/EventsService";

export class NuiEventsService extends EventsService {
    private static instance: NuiEventsService | null = null;
    public static getInstance(): NuiEventsService {
        if (!NuiEventsService.instance) {
            NuiEventsService.instance = new NuiEventsService();
        }
        return NuiEventsService.instance;
    }

    private nuiActive = false;

    constructor() {
        super();
        this.init();
    }

    public emit<D, T extends Events.Event<D>>(eventType: { new(arg:D | null): T }, data: D | null): Promise<D | null> {
        const event = new eventType(data);
        SendNuiMessage(JSON.stringify({ type: event.name, data: event.data }))
        return Promise.resolve(null);
    }

    public on<D, T extends Events.Event<D>>(eventType: { new(arg: D | null): T}): Observable<T> {
        const event = new eventType(null);
        if (!this.cachedObservables.has(event.name)) {
            const observable = fromEvent(window, "message").pipe(
                filter((messageEvent: any) => messageEvent.data.type === event.name),
                map(messageEvent => { return { name: messageEvent.data.type, data: messageEvent.data.data } })
            );
            this.cachedObservables.set(event.name, observable)
        }
        return this.cachedObservables.get(event.name)!;
    };

    private init(): void {
        setTick(() => {
            if (Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.InteractionMenu)) {
                this.toggleNUI();
            }
            if (this.nuiActive) {
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookLeftRight, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookUpDown, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.MeleeAttackAlternate, this.nuiActive);
                DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleMouseControlOverride, this.nuiActive);
            }
        })
    }

    public toggleNUI(): void {
        this.nuiActive = !this.nuiActive;
        SetNuiFocus(this.nuiActive, this.nuiActive);
        SetNuiFocusKeepInput(this.nuiActive);
    }

    public createNuiCallbackListener<D, T extends Events.Event<D>>(
        eventType: { new(arg:D | null): T },
        method: (data:D | null, cb: (response: D | null) => void) => void
    ) {
        const event = new eventType(null);
        RegisterNuiCallbackType(event.name);
        on(`__cfx_nui:${event.name}`, (data: D | null, cb: (response: D | null) => void) => {
            method(data, cb);
        });
    }
}
