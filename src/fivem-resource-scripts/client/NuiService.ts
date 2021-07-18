import * as Cfx from "fivem-js";

import { Events } from "../../events";

export class NuiService {
    private static instance: NuiService | null = null;
    public static getInstance(): NuiService {
        if (!NuiService.instance) {
            NuiService.instance = new NuiService();
        }
        return NuiService.instance;
    }

    private nuiActive = false;

    constructor() {
        this.init();
    }

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

    public sendMessage<D, T extends Events.Event<D>>(eventType: { new(arg:D): T }, data: D): void {
        // SendNuiMessage uses window.message system; therefore we need some special object formatting
        const event = new eventType(data);
        SendNuiMessage(JSON.stringify({ type: event.name, data: event.data }))
    }

    public createNuiCallbackListener<D, T extends Events.Event<D>>(eventType: { new(arg:D | null): T }, method: (data:D | null, cb: Function) => void) {
        const event = new eventType(null);
        RegisterNuiCallbackType(event.name);
        on(`__cfx_nui:${event.name}`, (data: D, cb: Function) => {
            method(data, cb);
        });
    }
}
