import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule  } from '@angular/material/input';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { AppRootComponent } from './app-root.component';
import { FormsModule } from '@angular/forms';
import { NotificationService } from './core/notification.service';
import { VehicleMenuComponent } from './vehicleMenu/vehicle-menu.component';

@NgModule({
    declarations: [
        AppRootComponent,
        VehicleMenuComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        MatFormFieldModule,
        AppRoutingModule,
        BrowserAnimationsModule
    ],
    providers: [
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}
    ],
    bootstrap: [AppRootComponent]
})
export class AppModule {
    constructor(notificationService: NotificationService) {}
}
