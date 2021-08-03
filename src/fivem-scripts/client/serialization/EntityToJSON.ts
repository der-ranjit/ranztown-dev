import { Entity } from "fivem-js";

import { FivemEntityJSON } from "../../../angular-fivem-shared/serialization/FivemEntityJSON";
import { READ_ONLY, toFivemJSONProperty, WRITE_ONLY } from "../../../angular-fivem-shared/serialization/FivemJSON";

export function EntityToJSON(entity: Entity): FivemEntityJSON {
    const result: FivemEntityJSON = {};
    // result.AttachedBlip = toJsonProperty(entity.AttachedBlip, READ_ONLY);
    // result.Bones = toJsonProperty(entity.Bones, READ_ONLY);
    result.Handle = toFivemJSONProperty(entity.Handle, READ_ONLY);
    result.HasCollided = toFivemJSONProperty(entity.HasCollided, READ_ONLY);
    result.HasGravity = toFivemJSONProperty(entity.HasGravity, WRITE_ONLY);
    result.Heading = toFivemJSONProperty(entity.Heading);
    result.Health = toFivemJSONProperty(entity.Health);
    result.HeightAboveGround = toFivemJSONProperty(entity.HeightAboveGround);
    result.IsCollisionEnabled = toFivemJSONProperty(entity.IsCollisionEnabled);
    result.IsInAir = toFivemJSONProperty(entity.IsInAir, READ_ONLY);
    result.IsInWater = toFivemJSONProperty(entity.IsInWater, READ_ONLY);
    result.IsInvincible = toFivemJSONProperty(entity.IsInvincible, WRITE_ONLY);
    result.IsOccluded = toFivemJSONProperty(entity.IsOccluded, READ_ONLY);
    result.IsOnFire = toFivemJSONProperty(entity.IsOnFire, READ_ONLY);
    result.IsOnScreen = toFivemJSONProperty(entity.IsOnScreen, READ_ONLY);
    result.IsOnlyDamagedByPlayer = toFivemJSONProperty(entity.IsOnlyDamagedByPlayer, WRITE_ONLY);
    result.IsPersistent = toFivemJSONProperty(entity.IsPersistent);
    result.IsPositionFrozen = toFivemJSONProperty(entity.IsPositionFrozen, WRITE_ONLY);
    result.IsRecordingCollisions = toFivemJSONProperty(entity.IsRecordingCollisions, WRITE_ONLY);
    result.IsUpright = toFivemJSONProperty(entity.IsUpright, READ_ONLY);
    result.IsUpsideDown = toFivemJSONProperty(entity.IsUpsideDown, READ_ONLY);
    result.IsVisible = toFivemJSONProperty(entity.IsVisible);
    result.LodDistance = toFivemJSONProperty(entity.LodDistance);
    result.MaxHealth = toFivemJSONProperty(entity.MaxHealth);
    result.MaxSpeed = toFivemJSONProperty(entity.MaxSpeed, WRITE_ONLY);
    // result.Model = toJsonProperty(entity.Model, READ_ONLY);
    result.NetworkId = toFivemJSONProperty(entity.NetworkId, READ_ONLY);
    result.Opacity = toFivemJSONProperty(entity.Opacity);
    result.Position = toFivemJSONProperty(entity.Position);
    result.PositionNoOffset = toFivemJSONProperty(entity.PositionNoOffset, WRITE_ONLY);
    result.Quaternion = toFivemJSONProperty(entity.Quaternion);
    result.Rotation = toFivemJSONProperty(entity.Rotation);
    result.RotationVelocity = toFivemJSONProperty(entity.RotationVelocity, READ_ONLY);
    result.SubmersionLevel = toFivemJSONProperty(entity.SubmersionLevel, READ_ONLY);
    result.Velocity = toFivemJSONProperty(entity.Velocity);

    return result;
}

