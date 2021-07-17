import { Component } from '@angular/core';
import { FiveMClientService } from './core/fivemClient.service';

@Component({
    selector: 'app-root',
    template: `
        <input type="text" #carModel>
        <button mat-raised-button (click)="handleSpawnCar(carModel.value)">Spawn car</button>
    `
})
export class AppRootComponent {
    constructor(private fivemClient: FiveMClientService) {
    }

    public async handleSpawnCar(carModel: string): Promise<void> {
        const result = await this.fivemClient.invoke("spawnCar", { model: carModel })
        console.log(result)
    }
}
