import { Vector3, Entity, Vehicle, Game } from "fivem-js";

import { NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";
import { DeleteEntity, GetEntityDataAtNuiCursor, GetEntityData, UpdateEntity, EntityType, GetPlayerVehicleData } from "../../shared/nui-events/callbacks";
import { raycastFromScreenPointerToWorld } from "./NuiRaycast";
import { isVec3 } from "../../shared/Vector";
import { EntityJSON, EntityToJson } from "../serialization/EntityJson";
import { VehicleJSON, VehicleToJson } from "../serialization/VehicleJson";

@NuiCallbackEvents
export class EntityManager {
    private static instance: EntityManager | null = null;
    public static getInstance(): EntityManager {
        if (!EntityManager.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    }
    @NuiCallbackListener(DeleteEntity)
    public async deleteEntity(event: DeleteEntity) {
        Entity.fromHandle(event.data.handle)?.delete();
    }

    @NuiCallbackListener(GetEntityDataAtNuiCursor)
    public async getEntityDataAtNuiCursor(event: GetEntityDataAtNuiCursor) {
        const raycastResult = raycastFromScreenPointerToWorld();
        if (raycastResult.DidHit && raycastResult.HitEntity) {
            const entity = raycastResult.HitEntity;
           const json = this.createJSONForEntity(entity);
           if (json != null) {
               return json;
           }
        }
        return null;
    }

    @NuiCallbackListener(GetEntityData)
    public async getEntityData(event: GetEntityData) {
        const data = event.data;
        if (data?.handle) {
            const entity = Entity.fromHandle(data.handle);
            const json = this.createJSONForEntity(entity);
            if (json != null) {
                return json;
            }
        }
        return null;
    }

    @NuiCallbackListener(GetPlayerVehicleData)
    public async getPlayerVehicleData(event: GetPlayerVehicleData) {
        if (Game.PlayerPed.isInAnyVehicle()) {
            const vehicle = Game.PlayerPed.CurrentVehicle;
            return VehicleToJson(vehicle);
        } else {
            return null;
        }
    }

    @NuiCallbackListener(UpdateEntity)
    public async updateEntity(event: UpdateEntity) {
        const data = event.data;
        if (data?.handle && data?.propertyPaths && data?.value !== undefined) {
            const entity = Entity.fromHandle(data.handle);
            let value = data.value;
            if (isVec3(value)) {
                value = Vector3.create(value);
            }

            setPropertyByPaths(entity, data.propertyPaths, value);
        }
    }

    private createJSONForEntity(entity: Entity): EntityJSON | VehicleJSON | null {
        const eType = GetEntityType(entity.Handle);
        let type: EntityType = "no entity";
        if(eType === 1) {
            type = "ped";
            return EntityToJson(entity);
        } else if (eType === 2) {
            type = "vehicle";
            return VehicleToJson(entity as Vehicle);
        } else if (eType === 3) {
            type = "object";
            return EntityToJson(entity);
        }
        return null;
    }

}

function setPropertyByPaths(object: any, propertyPaths: string[], value: any) {
    if (propertyPaths.length === 1) {
        object[propertyPaths[0]] = value;
        return
    }
    // } else if (propertyPaths.length > 1) {
    //     let tmp = object;
    //     for (let i = 0; i < propertyPaths.length -1; i++) {
    //         tmp = object[propertyPaths[i]];
    //         console.log(tmp);
    //     }
    //     console.log(tmp);
    //     console.log(propertyPaths[propertyPaths.length-1]);
    //     tmp[propertyPaths[propertyPaths.length-1]] = value;
    // }
}
