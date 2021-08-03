import { Pipe, PipeTransform } from "@angular/core";
import { FileUrlResolver } from "./file-url-resolver";

@Pipe({name: "resolveFileUrl"})
export class ResolveFileUrlPipe implements PipeTransform {
    constructor(private fileUrlResolver: FileUrlResolver) {}

    public transform(filePath: string): string {
        return this.fileUrlResolver.resolve(filePath);
    }
}
