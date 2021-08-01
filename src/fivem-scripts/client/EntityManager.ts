import { Vector3, Entity } from "fivem-js";

import { NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";
import { DefaultCallbackResponse, DeleteEntity, EntityType, GetEntityAtCursor, GetEntityData, UpdateEntity } from "../../shared/nui-events/callbacks";
import { raycastFromScreenPointerToWorld } from "./NuiRaycast";
import { EntityToJson } from "../serialization/EntityJson";
import { isVec3 } from "../../shared/Vector";


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

    @NuiCallbackListener(GetEntityAtCursor)
    public async getEntityAtCursor(event: GetEntityAtCursor) {
        const raycastResult = raycastFromScreenPointerToWorld();
        if (raycastResult.DidHit && raycastResult.HitEntity) {
            const entity = raycastResult.HitEntity;
            const eType = GetEntityType(entity.Handle);
            let type: EntityType = "no entity";
            if (eType === 0) {
                type = "no entity";
            } else if(eType === 1) {
                type = "ped";
            } else if (eType === 2) {
                type = "vehicle";
            } else if (eType === 3) {
                type = "object";
            }
            // const result = {
            //     health: entity.Health,
            //     model: entity.Model.Hash,
            //     networkId: entity.NetworkId,
            //     position: fromVector3(entity.Position),
            //     velocity: fromVector3(entity.Velocity),
            //     handle: entity.Handle,
            //     type
            // };
            return EntityToJson(entity);
        }
        return DefaultCallbackResponse;
    }

    @NuiCallbackListener(GetEntityData)
    public async getEntityData(event: GetEntityData) {
        const data = event.data;
        if (data?.handle) {
            const entity = Entity.fromHandle(data.handle);
            return EntityToJson(entity);
        }
        return DefaultCallbackResponse;
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
