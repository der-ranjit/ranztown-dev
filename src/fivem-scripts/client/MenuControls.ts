import * as Cfx from "fivem-js";
import { Vector3, WeaponHash } from "fivem-js";

import { Callback, Message } from "../../shared/nui-events";
import { CfxNuiEventsService, NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";

@NuiCallbackEvents
export class MenuControls {
    private static instance: MenuControls | null = null;
    public static getInstance(): MenuControls {
        if (!MenuControls.instance) {
            MenuControls.instance = new MenuControls();
        }
        return MenuControls.instance;
    }

    private events = CfxNuiEventsService.getInstance();
    private nuiActive = false;
    private nuiActivating = false;
    /* the game is too fast and registers the menu key multiple times, toggling it more than one time. debounce! */
    private nuiDebounceMS = 350;

    private controlsDisabled = false;


    constructor() {
        this.initControls();
    }

    @NuiCallbackListener(Callback.SetControlsDisabled)
    public async setControlsDisabled(event: Callback.SetControlsDisabled): Promise<void> {
        this.controlsDisabled = event.data.disabled;
    }

    @NuiCallbackListener(Callback.FlyHigh)
    public async flyHigh(event: Callback.FlyHigh): Promise<void> {
        const playerPosition = Cfx.Game.PlayerPed.Position;
        Cfx.Game.PlayerPed.Position = new Vector3(playerPosition.x, playerPosition.y, playerPosition.z + 100);
        Cfx.Game.PlayerPed.giveWeapon(WeaponHash.Parachute, 1, false, true);
        //GiveWeaponToPed(GetPlayerPed(-1), GetHashKey("gadget_parachute"), 1, false, true)
        //SetPedComponentVariation(GetPlayerPed(-1), 5, 0, 0, 0);
    }

    private initControls(): void {
        setTick(() => {
            // open on F1
            if (Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleDuck) && !this.nuiActivating) {
                this.toggle();
                this.nuiActivating = true;
            }
            // close on ESC
            if (this.nuiActive && Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.ReplayToggleTimeline)) {
                this.disableNUI();
            }
            if (this.nuiActive) {
                if(this.controlsDisabled) {
                    DisableAllControlActions(0);
                } else {
                    EnableAllControlActions(0);
                    this.disableControlsForMenu()
                }

            }
            // allow looking around when right mouse is pressed in vehicle
            const isAiming = Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleAim)
                || Cfx.Game.isControlPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.Aim)
            if (this.nuiActive && isAiming) {
                EnableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookLeftRight, true);
                EnableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookUpDown, true);
            }
        })
    }

    private toggle(): void {
        this.nuiActive = !this.nuiActive;
        SetNuiFocus(this.nuiActive, this.nuiActive);
        SetNuiFocusKeepInput(this.nuiActive);
        this.events.emitNuiMessage(Message.SetNuiVisibility, { nuiVisible: this.nuiActive });
        setTimeout(() => this.nuiActivating = false, this.nuiDebounceMS)
    }

    private disableNUI(): void {
        SetNuiFocus(false, false);
        SetNuiFocusKeepInput(false);
        this.events.emitNuiMessage(Message.SetNuiVisibility, { nuiVisible: false });
        // setTimeout to disable controls some longer; in case esc is pressed the pause menu would open
        setTimeout(() => {
            this.nuiActive = false;
            this.nuiActivating = false;
        }, 300)
    }

    private disableControlsForMenu(): void {
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookLeftRight, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.LookUpDown, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.MoveLeftRight, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.MoveUpDown, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleExit, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.MeleeAttackAlternate, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleMouseControlOverride, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleHorn, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.Enter, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleRadioWheel, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleNextRadio, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehiclePrevRadio, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.WeaponWheelUpDown, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.WeaponWheelLeftRight, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.WeaponWheelNext, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.WeaponWheelPrev, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.NextWeapon, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.PrevWeapon, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.SelectNextWeapon, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.SelectPrevWeapon, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleSelectNextWeapon, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.SelectWeapon, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.CharacterWheel, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.Duck, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.FrontendPauseAlternate, this.nuiActive);
        DisableControlAction(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.FrontendPause, this.nuiActive);
    }
}
