import { sleep } from "../../../angular-fivem-shared/utils";

export class Text {
    public static draw2DText(x: number, y: number, text: string, scale: number) {
        SetTextFont(4);
        SetTextScale(scale, scale);
        SetTextColour(255, 255, 255, 255);
        SetTextDropshadow(0, 0, 0, 0,255);
        SetTextDropShadow()
        SetTextEdge(4, 0, 0, 0, 255)
        SetTextOutline()
        SetTextEntry("STRING")
        AddTextComponentString(text)
        DrawText(x, y)
    }

    public static async createCountdown(
        steps: string[],
        intervalMS: number,
        finishText: string,
        animationMinScale: number,
        animationMaxScale: number
    ) {
        let currentStep = 0;
        let displayText = steps[currentStep];
        const tickHandler = setTick(() => {
            // TODO better centering
            Text.draw2DText(0.5, 0.4, displayText, 3.0)
        })
        for (let step of steps) {
            await sleep(intervalMS);
            currentStep++;
            displayText = steps[currentStep];
        }
        displayText = finishText;
        // return when countdown has finished, and set a timeout to later stop the tick handler
        setTimeout(() => clearTick(tickHandler), intervalMS);
    }
}
