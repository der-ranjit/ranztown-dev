import * as Cfx from "fivem-js";
import { Vector3 } from "fivem-js";
import { Vector2 } from "../../angular-fivem-shared/Vector";
import { Vector3Ext } from "../client-server-shared/Vector";

export function raycastFromScreenPointerToWorld(intersectionFlags = 30, ignoredEntity = 0, raycastLength = 50.0) {
    const cameraRotation = Cfx.GameplayCamera.Rotation;
    const cameraPosition = Cfx.GameplayCamera.Position;
    const cursorPosition = getRelativeCursorPosition();
    const { relative3DPosition, forwardDirection } = getScreenPositionRelativeToWorld(cameraPosition, cameraRotation, cursorPosition);
    const direction = Vector3.add(relative3DPosition, Vector3.multiply(forwardDirection, raycastLength));
    const rayHandle = StartShapeTestRay(
        relative3DPosition.x,
        relative3DPosition.y,
        relative3DPosition.z,
        direction.x,
        direction.y,
        direction.z,
        intersectionFlags,
        ignoredEntity,
        0
    );
    const raycastResult = new Cfx.RaycastResult(rayHandle);
    return raycastResult;
}

function getScreenPositionRelativeToWorld(
    cameraPosition: Vector3,
    cameraRotation: Vector3,
    cursorPosition: Vector2
): { relative3DPosition: Vector3, forwardDirection: Vector3 } {
    const cameraForward = rotationToDirection(cameraRotation);
    const rotationUp = new Vector3(cameraRotation.x + 1.0, cameraRotation.y, cameraRotation.z);
    const rotationDown = new Vector3(cameraRotation.x - 1.0, cameraRotation.y, cameraRotation.z);
    const rotationLeft = new Vector3(cameraRotation.x, cameraRotation.y, cameraRotation.z - 1.0);
    const rotationRight = new Vector3(cameraRotation.x, cameraRotation.y, cameraRotation.z + 1.0);
    const cameraRight = Vector3.subtract(rotationToDirection(rotationRight), rotationToDirection(rotationLeft));
    const cameraUp = Vector3.subtract(rotationToDirection(rotationUp), rotationToDirection(rotationDown));
    const rollRad = -(cameraRotation.y * Math.PI / 180.0)
    const cameraRightRoll = Vector3.subtract(Vector3.multiply(cameraRight, Math.cos(rollRad)), Vector3.multiply(cameraUp, Math.sin(rollRad)));
    const cameraUpRoll = Vector3.add(Vector3.multiply(cameraRight, Math.sin(rollRad)), Vector3.multiply(cameraUp, Math.cos(rollRad)));
    const point3DZero = Vector3.add(cameraPosition, Vector3.multiply(cameraForward, 1.0));
    const point3D = Vector3Ext.addMultiple(point3DZero, cameraRightRoll, cameraUpRoll);
    const point2D = world3DToScreen2D(point3D)
    const point2DZero = world3DToScreen2D(point3DZero)
    const scaleX = (cursorPosition.x - point2DZero.x) / (point2D.x - point2DZero.x)
    const scaleY = (cursorPosition.y - point2DZero.y) / (point2D.y - point2DZero.y)
    const relative3DPosition = Vector3Ext.addMultiple(point3DZero, Vector3.multiply(cameraRightRoll, scaleX), Vector3.multiply(cameraUpRoll, scaleY));
    const forwardDirection = Vector3Ext.addMultiple(cameraForward, Vector3.multiply(cameraRightRoll, scaleX), Vector3.multiply(cameraUpRoll, scaleY));
    return { relative3DPosition, forwardDirection }
}

function rotationToDirection(rotation: Vector3): Vector3{
    const x = rotation.x * Math.PI / 180.0;
    // const y = rotation.y * Math.PI / 180.0;
    const z = rotation.z * Math.PI / 180.0;
    const factor = Math.abs(Math.cos(x));
    return new Vector3((-Math.sin(z) * factor), (Math.cos(z) * factor), Math.sin(x));
}

function world3DToScreen2D(position: Vector3): Vector2 {
    const coords = GetScreenCoordFromWorldCoord(position.x, position.y, position.z);
    return { x: coords[1], y: coords[2] };
}

function getRelativeCursorPosition(): Vector2 {
    const x = GetControlNormal(0, Cfx.Control.CursorX)
    const y = GetControlNormal(0, Cfx.Control.CursorY)
    return {x, y};
}
