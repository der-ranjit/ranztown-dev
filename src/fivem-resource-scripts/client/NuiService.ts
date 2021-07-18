import * as Cfx from "fivem-js";

import * as NuiActions from "src/actions/nui.actions";

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

    public sendMessage<T extends NuiActions.Action>(action: T): void {
        SendNuiMessage(JSON.stringify({ type: action.name, data: action.data }))
    }
}
