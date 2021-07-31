import { Vector3, Entity } from "fivem-js";
import { Vec3 } from "fivem-js/lib/utils/Vector3";

import { NuiCallbackEvents, NuiCallbackListener } from "./NuiEventsService";
import { DeleteEntity, EntityType, GetEntityAtCursor } from "../../shared/nui-events/callbacks";
import { raycastFromScreenPointerToWorld } from "./NuiRaycast";


function fromVector3(vector: Vector3): Vec3 {
    const {x, y, z} = vector;
    return {x, y, z};
}

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
        if (raycastResult.DidHit) {
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
            const result = {
                health: entity.Health,
                model: entity.Model.Hash,
                networkId: entity.NetworkId,
                position: fromVector3(entity.Position),
                velocity: fromVector3(entity.Velocity),
                handle: entity.Handle,
                type
            };
            return result;
        }
        return null;
    }
}
