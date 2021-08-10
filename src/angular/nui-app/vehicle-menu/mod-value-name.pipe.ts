import { Pipe, PipeTransform } from "@angular/core";
import { VehicleModType } from "fivem-js/lib/enums/Vehicle";
import { VehicleMod11_Engine } from "../../../angular-fivem-shared/gta-data/VehicleMod11_Engine";
import { VehicleMod12_Brakes } from "../../../angular-fivem-shared/gta-data/VehicleMod12_Brakes";
import { VehicleMod13_Transmission } from "../../../angular-fivem-shared/gta-data/VehicleMod13_Transmission";
import { VehicleMod14_Horn } from "../../../angular-fivem-shared/gta-data/VehicleMod14_Horn";
import { VehicleMod15_Suspension } from "../../../angular-fivem-shared/gta-data/VehicleMod15_Suspension";
import { VehicleMod16_Armor } from "../../../angular-fivem-shared/gta-data/VehicleMod16_Armor";
import { VehicleMod18_Turbo } from "../../../angular-fivem-shared/gta-data/VehicleMod18_Turbo";
import { VehicleMod22_Xenon } from "../../../angular-fivem-shared/gta-data/VehicleMod22_Xenon";
import { VehicleMod40_Boost } from "../../../angular-fivem-shared/gta-data/VehicleMod40_Boost";
import { VehicleMod46_Windows } from "../../../angular-fivem-shared/gta-data/VehicleMod46_Windows";
import { VehicleMod53_PlateTypes } from "../../../angular-fivem-shared/gta-data/VehicleMod53_PlateTypes";

@Pipe({name: "modValueName"})
export class ModValueNamePipe implements PipeTransform {
    public transform(modDisplayName: string | null, modType: number, modIndex: number ): string {
        if (modType === 12) {
            console.log(modIndex);
        }
        if (modDisplayName != null && modDisplayName !== "NULL") {
            return modDisplayName;
        }
        let valueName = `${modIndex - 1} (unknown)`;
        let nameEnum: {[key: number]: string} = {};

        if (modType === VehicleModType.Engine) {
            nameEnum = VehicleMod11_Engine;
        } else if (modType === VehicleModType.Brakes) {
            nameEnum = VehicleMod12_Brakes;
        } else if (modType === VehicleModType.Transmission) {
            nameEnum = VehicleMod13_Transmission;
        } else if (modType === VehicleModType.Horns) {
            nameEnum = VehicleMod14_Horn;
        } else if (modType === VehicleModType.Suspension) {
            nameEnum = VehicleMod15_Suspension;
        } else if (modType === VehicleModType.Armor) {
            nameEnum = VehicleMod16_Armor;
        } else if (modType === 18) {
            nameEnum = VehicleMod18_Turbo;
        } else if (modType === 22) {
            nameEnum = VehicleMod22_Xenon;
        } else if (modType === VehicleModType.AirFilter) {
            nameEnum = VehicleMod40_Boost;
        } else if (modType === VehicleModType.Windows) {
            nameEnum = VehicleMod46_Windows;
        } else if (modType === 53) {
            nameEnum = VehicleMod53_PlateTypes;
        }

        const mappedName = nameEnum[modIndex - 1];
        if (mappedName !== undefined) {
            valueName = mappedName;
        }

        return valueName;
    }
}
