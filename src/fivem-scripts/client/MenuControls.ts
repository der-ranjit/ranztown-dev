import * as Cfx from "fivem-js";
import { Entity } from "fivem-js";

import { Callback, Message } from "../../shared/nui-events";
import { NuiMode } from "../../shared/nui-events/messages";
import { CfxNuiEventsService, NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";
import { raycastFromScreenPointerToWorld } from "./NuiRaycast";

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
    private nuiMode: NuiMode = "inactive";
    private readonly preventPauseMenuTimer = 300;
    private readonly inspectorModeHoldTime = 500;

    private controlsDisabled = false;

    private inspectorModeTimeout: number | null = null;
    lastInspectedEntityHandle: number | null = null;

    constructor() {
        this.initControls();
    }

    @NuiCallbackListener(Callback.SetControlsDisabled)
    public async setControlsDisabled(event: Callback.SetControlsDisabled): Promise<void> {
        this.controlsDisabled = event.data.disabled;
    }

    private initControls(): void {
        setTick(() => {
            // open on X
            if (Cfx.Game.isControlJustPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleDuck)) {
                if (this.nuiMode !== "inactive") {
                    this.disableNUI();
                } else {
                    this.inspectorModeTimeout = setTimeout(()=>{
                        this.setNuiMode("inspector");
                        this.inspectorModeTimeout = null;
                    }, this.inspectorModeHoldTime) as any
                }
            }
            if (Cfx.Game.isControlJustReleased(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.VehicleDuck)) {
                if (this.inspectorModeTimeout) {
                    clearTimeout(this.inspectorModeTimeout);
                    this.inspectorModeTimeout = null;
                    this.setNuiMode("menu");
                }
            }
            // close on ESC
            if (this.nuiActive && Cfx.Game.isControlJustPressed(Cfx.InputMode.MouseAndKeyboard, Cfx.Control.ReplayToggleTimeline)) {
                this.disableNUI();
            }
            if (this.nuiActive) {
                if(this.controlsDisabled) {
                    DisableAllControlActions(0);
                } else {
                    EnableAllControlActions(0);
                    this.disableControlsForMenu()
                }
                if(this.nuiMode === "inspector") {
                    const raycastResult = raycastFromScreenPointerToWorld();
                    if (raycastResult.DidHit && raycastResult.DidHitEntity) {
                        this.resetLastInspectedOpacity();
                        this.setInspectedEntity(raycastResult.HitEntity);

                    } else {
                        this.resetLastInspectedOpacity();
                    }
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

    private setInspectedEntity(entity: Entity) {
        this.lastInspectedEntityHandle = entity.Handle;
        entity.Opacity = 0.8;
    }

    private resetLastInspectedOpacity() {
        if (this.lastInspectedEntityHandle != null) {
            const entity = Entity.fromHandle(this.lastInspectedEntityHandle);
            entity.resetOpacity();
            this.lastInspectedEntityHandle = null;
        }
    }

    private setNuiMode(nuiMode: NuiMode): void {
        this.nuiMode = nuiMode;
        this.nuiActive = nuiMode !== "inactive";
        SetNuiFocus(this.nuiActive, this.nuiActive);
        SetNuiFocusKeepInput(this.nuiActive);
        this.events.emitNuiMessage(Message.SetNuiMode, { nuiMode });
    }

    private disableNUI(): void {
        this.nuiMode = "inactive";
        SetNuiFocus(false, false);
        SetNuiFocusKeepInput(false);
        this.resetLastInspectedOpacity();
        this.events.emitNuiMessage(Message.SetNuiMode, { nuiMode: "inactive" });
        // setTimeout to disable controls some longer; in case esc is pressed the pause menu would open
        setTimeout(() => {
            this.nuiActive = false;
        }, this.preventPauseMenuTimer)
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
