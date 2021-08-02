import { Pipe, PipeTransform } from "@angular/core";
import { VehicleModType } from "fivem-js/lib/enums/Vehicle";

@Pipe({name: "modSlotName"})
export class ModSlotNamePipe implements PipeTransform {
    public transform(modType: number): string {
        return VehicleModType[modType];
    }
}
