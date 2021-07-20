import { CallbackConstructorType } from "./callbacks";
import { MessageConstructorType } from "./messages";

export function getEventName<T,D,R>(
    eventType: MessageConstructorType<T,D> | CallbackConstructorType<T,D,R>
) {
    return (eventType as any).eventName;
}
