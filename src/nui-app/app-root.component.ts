import { Component } from '@angular/core';
import { FiveMClientService } from './core/fivemClient.service';
@Component({
    selector: 'app-root',
    template: `
        <mat-form-field appearance="fill">
            <mat-label>Enter car model</mat-label>
            <input class="input-background" type="text" #carModel matInput>
        </mat-form-field>
        <button mat-raised-button (click)="handleSpawnCar(carModel.value)">Spawn car</button>
    `,
    styles: [`
        .input-background {
            background-color: white
        }
    `]
})
export class AppRootComponent {
    constructor(private fivemClient: FiveMClientService) {
    }

    public async handleSpawnCar(carModel: string): Promise<void> {
        const result = await this.fivemClient.invoke("spawnCar", { model: carModel })
        console.log(result)
    }
}
