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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule} from '@angular/material/menu';
import { MatIconModule} from '@angular/material/icon';

import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { AppRoutingModule } from './app-routing.module';
import { AppRootComponent } from './app-root.component';

import { NotificationService } from './core/notification.service';
import { VehicleMenuComponent } from './vehicleMenu/vehicle-menu.component';
import { PedMenuComponent } from './pedMenu/ped-menu.component';
import { FlyHighComponent } from './flyHigh/flyHigh.component';
import { AppNuiEventsService } from './core/nui-events/nuiEvents.service';
import { ExclusiveInputDirective } from './core/exclusiveInput.directive';
import { LocationsMenuComponent } from './locationsMenu/locationsMenu';
import { FileUrlResolver } from './core/fileUrlResolver';
import { ResolveFileUrlPipe } from './core/resolveFileUrl.pipe';
import { ThemeChooserButtonComponent } from './core/themeChooserButton';
import { VirtualFilterListComponent } from './common/virtualFilterList';
import { EntityContextMenuComponent } from './entityContextMenu/entityContextMenu';
import { EntityDebuggerComponent } from './core/entityDebugger/entityDebugger';

@NgModule({
    declarations: [
        AppRootComponent,
        VehicleMenuComponent,
        PedMenuComponent,
        FlyHighComponent,
        ExclusiveInputDirective,
        LocationsMenuComponent,
        ResolveFileUrlPipe,
        ThemeChooserButtonComponent,
        VirtualFilterListComponent,
        EntityContextMenuComponent,
        EntityDebuggerComponent
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
        BrowserAnimationsModule,
        VirtualScrollerModule,
        MatMenuModule,
        MatIconModule
    ],
    providers: [
        { provide: AppNuiEventsService, useValue: AppNuiEventsService.getInstance() }
    ],
    bootstrap: [AppRootComponent]
})
export class AppModule {
    // construct some services as early as possible so that they can get some data from the client before
    // components need to initialize
    constructor(
        notificationService: NotificationService,
        fileUrlResolver: FileUrlResolver
    ) {}
}
