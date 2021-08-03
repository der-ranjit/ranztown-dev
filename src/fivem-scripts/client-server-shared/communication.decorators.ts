export function OnNet(eventName: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        // TODO fix scope
        onNet(eventName, originalMethod);
    }
}
