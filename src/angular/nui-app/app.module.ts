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
import { MatSelectModule} from '@angular/material/select';


import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { AppRootComponent } from './app-root.component';

import { NotificationService } from './_core/notification.service';
import { VehicleMenuComponent } from './vehicle-menu/vehicle-menu.component';
import { CircularMenuComponent } from './circular-menu/circular-menu.component';
import { PedMenuComponent } from './ped-menu/ped-menu.component';
import { FlyHighComponent } from './fly-high/fly-high.component';
import { AppNuiEventsService } from './_core/nui-events/nui-events.service';
import { ExclusiveInputDirective } from './_core/exclusive-input.directive';
import { LocationsMenuComponent } from './locations-menu/locations-menu';
import { FileUrlResolver } from './_core/file-url-resolver';
import { ResolveFileUrlPipe } from './_core/resolve-file-url.pipe';
import { ThemeChooserButtonComponent } from './_core/theme-chooser-button';
import { VirtualFilterListComponent } from './_core/virtual-filter-list';
import { EntityContextMenuComponent } from './entity-context-menu/entity-context-menu';
import { EntityDebuggerComponent } from './_core/entity-debugger/entity-debugger';
import { ModSlotNamePipe } from './vehicle-menu/mod-slot-name.pipe';

@NgModule({
    declarations: [
        AppRootComponent,
        VehicleMenuComponent,
        CircularMenuComponent,
        PedMenuComponent,
        FlyHighComponent,
        ExclusiveInputDirective,
        LocationsMenuComponent,
        ResolveFileUrlPipe,
        ThemeChooserButtonComponent,
        VirtualFilterListComponent,
        EntityContextMenuComponent,
        EntityDebuggerComponent,
        ModSlotNamePipe
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
        BrowserAnimationsModule,
        VirtualScrollerModule,
        MatMenuModule,
        MatIconModule,
        MatSelectModule
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
