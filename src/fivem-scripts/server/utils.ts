export const LOCALHOST = "127.0.0.1";

export namespace ServerUtils {
    export function getFivemId(source: number): string {
        const identifiers = getPlayerIdentifiers(source.toString());
        return identifiers.find(identifier => identifier.indexOf("fivem:") !== -1)!.replace(":", "_");
    }

    export function getIp(source: number): string {
        const identifiers = getPlayerIdentifiers(source.toString());
        return identifiers.find(identifier => identifier.indexOf("ip:") !== -1)!.replace(":", "_");
    }
}
