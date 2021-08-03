/* stupid way to initialize classes that have a static getInstance */
export async function bootstrap(bootstrappedClasses: {new (...args: any[]): any}[]) {
    for(let bootstrappedClass of bootstrappedClasses) {
        const classAsAny = bootstrappedClass as any;
        if (classAsAny?.getInstance) {
            await classAsAny.getInstance();
        }
    }
}
