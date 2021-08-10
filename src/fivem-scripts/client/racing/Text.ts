import { clamp } from "fivem-js";

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

    public static createCountdown(
        steps: string[],
        intervalMS: number,
        finishText: string,
        animationMinScaleFloat: number,
        animationMaxScaleFloat: number
    ) {
        return new Promise<void>(async resolve => {
            let currentStep = 0;
            let displayText = steps[currentStep];
            let currentAnimationScale = animationMaxScaleFloat;
            let countdownEnded = false;

            let stepStartTime = Date.now();
            const tickHandler = setTick(() => {
                const elapsed = Date.now() - stepStartTime;

                const progress = elapsed/intervalMS;
                currentAnimationScale = clamp((1 - progress) * animationMaxScaleFloat, animationMinScaleFloat, animationMaxScaleFloat);

                if (elapsed >= intervalMS && !countdownEnded) {
                    currentStep++;
                    stepStartTime = Date.now();
                    if (steps[currentStep] !== undefined) {
                        displayText = steps[currentStep];
                    } else {
                        displayText = finishText;
                        countdownEnded = true;
                        resolve();
                        // return when countdown has finished, and set a timeout to later stop the tick handler
                        setTimeout(() => clearTick(tickHandler), intervalMS);
                    }
                }

                // TODO better centering
                Text.draw2DText(0.5, 0.4, displayText, currentAnimationScale)
            })
        })
    }
}
