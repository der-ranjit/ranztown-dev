import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule  } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { DragDropModule } from "@angular/cdk/drag-drop"
import { MatExpansionModule} from "@angular/material/expansion";
import { AppRoutingModule } from './app-routing.module';
import { AppRootComponent } from './app-root.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NotificationService } from './core/notification.service';
import { VehicleMenuComponent } from './vehicleMenu/vehicle-menu.component';
import { FlyHighComponent } from './flyHigh/flyHigh.component';
import { AppNuiEventsService } from './core/nui-events/nuiEvents.service';
import { ExclusiveInputDirective } from './core/exclusiveInput.directive';
import { LocationsMenuComponent } from './locationsMenu/locationsMenu';

@NgModule({
    declarations: [
        AppRootComponent,
        VehicleMenuComponent,
        FlyHighComponent,
        ExclusiveInputDirective,
        LocationsMenuComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatToolbarModule,
        DragDropModule,
        MatExpansionModule,
        MatAutocompleteModule,
        AppRoutingModule,
        BrowserAnimationsModule
    ],
    providers: [
        { provide: AppNuiEventsService, useValue: AppNuiEventsService.getInstance() }
    ],
    bootstrap: [AppRootComponent]
})
export class AppModule {
    constructor(notificationService: NotificationService) {}
}
