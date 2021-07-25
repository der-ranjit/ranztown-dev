export namespace ServerUtils {
    export function getFivemId(source: number): string {
        const identifiers = getPlayerIdentifiers(source.toString());
        return identifiers.find(identifier => identifier.indexOf("fivem:") !== -1)!;
    }
}
