import { Component } from "@angular/core";

@Component({
    selector: "app-theme-chooser-button",
    template: `
        <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Example icon-button with a menu">
            <mat-icon>format_color_fill</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="changeTheme('dark')"> default </button>
            <button mat-menu-item (click)="changeTheme('light')"> test </button>
        </mat-menu>
    `
})
export class ThemeChooserButtonComponent {
    public changeTheme(themeName: string): void {
        const currentThemeClasses =
            document.body.classList.value.split(` `).filter(className => className.indexOf("-theme") !== -1);
        document.body.classList.remove(...currentThemeClasses);
        document.body.classList.add(`${themeName}-theme`);
    }
}
