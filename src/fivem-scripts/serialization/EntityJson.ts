import { Entity } from "fivem-js";
import { FivemJSON, toJsonProperty } from "../../shared/serialization/FivemJson";

export type EntityJSON = FivemJSON<Entity>;

export function EntityToJson(entity: Entity): FivemJSON<Entity> {
    const result: FivemJSON<Entity> = {};
    // result.AttachedBlip = toJsonProperty(entity.AttachedBlip);
    // result.Bones = toJsonProperty(entity.Bones);
    result.Handle = toJsonProperty(entity.Handle, true);
    result.HasCollided = toJsonProperty(entity.HasCollided, true);
    result.HasGravity = toJsonProperty(entity.HasGravity);
    result.Heading = toJsonProperty(entity.Heading);
    result.Health = toJsonProperty(entity.Health);
    result.HeightAboveGround = toJsonProperty(entity.HeightAboveGround);
    result.IsCollisionEnabled = toJsonProperty(entity.IsCollisionEnabled);
    result.IsInAir = toJsonProperty(entity.IsInAir, true);
    result.IsInWater = toJsonProperty(entity.IsInWater, true);
    result.IsInvincible = toJsonProperty(entity.IsInvincible);
    result.IsOccluded = toJsonProperty(entity.IsOccluded, true);
    result.IsOnFire = toJsonProperty(entity.IsOnFire, true);
    result.IsOnScreen = toJsonProperty(entity.IsOnScreen, true);
    result.IsOnlyDamagedByPlayer = toJsonProperty(entity.IsOnlyDamagedByPlayer);
    result.IsPersistent = toJsonProperty(entity.IsPersistent);
    result.IsPositionFrozen = toJsonProperty(entity.IsPositionFrozen);
    result.IsRecordingCollisions = toJsonProperty(entity.IsRecordingCollisions);
    result.IsUpright = toJsonProperty(entity.IsUpright, true);
    result.IsUpsideDown = toJsonProperty(entity.IsUpsideDown, true);
    result.IsVisible = toJsonProperty(entity.IsVisible);
    result.LodDistance = toJsonProperty(entity.LodDistance);
    result.MaxHealth = toJsonProperty(entity.MaxHealth);
    result.MaxSpeed = toJsonProperty(entity.MaxSpeed);
    result.Model = toJsonProperty(entity.Model, true);
    result.NetworkId = toJsonProperty(entity.NetworkId, true);
    result.Opacity = toJsonProperty(entity.Opacity);
    result.Position = toJsonProperty(entity.Position);
    result.PositionNoOffset = toJsonProperty(entity.PositionNoOffset);
    result.Quaternion = toJsonProperty(entity.Quaternion);
    result.Rotation = toJsonProperty(entity.Rotation);
    result.RotationVelocity = toJsonProperty(entity.RotationVelocity, true);
    result.SubmersionLevel = toJsonProperty(entity.SubmersionLevel, true);
    result.Velocity = toJsonProperty(entity.Velocity);

    return result;
}
