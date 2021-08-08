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
}