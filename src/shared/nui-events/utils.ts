import { CallbackConstructor } from "./callbacks";
import { MessageConstructor } from "./messages";

export function getEventNameFromEventType<T,D,R>(
    eventType: MessageConstructor<T,D> | CallbackConstructor<T,D,R>
) {
    return (eventType as any).eventName;
}
