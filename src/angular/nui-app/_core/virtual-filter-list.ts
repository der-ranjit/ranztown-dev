import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";

import { VirtualScrollerComponent } from "ngx-virtual-scroller";
import { Subject, BehaviorSubject } from "rxjs";
import { startWith, takeUntil, tap } from "rxjs/operators";

@Component({
    selector: "app-virtual-filter-list",
    template: `
        <mat-form-field appearance="fill" color="accent">
            <mat-label>{{ filterLabel }}</mat-label>
            <input matInput #filterInput
                exclusiveInput
                [formControl]="formControl"
                (keydown.enter)="onEnter.next(formControl.value)">
            <mat-hint *ngIf="filterDescription">{{ filterDescription }}</mat-hint>
        </mat-form-field>
        <virtual-scroller [style.height.px]="virtualScrollerHeight" #virtualScroller [items]="(filteredItems$ | async)!">
            <ng-content></ng-content>
        </virtual-scroller>
    `,
    styles: [`
        :host {
            display: flex;
            flex: 1;
            flex-direction: column;
            overflow: hidden;
        }
        :host ::ng-deep .scrollable-content {
            display: flex;
            flex: 1;
            flex-wrap: wrap;
            justify-content: space-around;
        }
        :host ::ng-deep .virtualFilterItem {
            position: relative;
            width: 120px;
            height: 100px;
            margin-top: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            border-radius: 5px;
            background-size: contain;
            background-repeat: no-repeat;
            background-color: white;
            background-position: center;
        }
    `],
})
export class VirtualFilterListComponent implements OnDestroy {
    @Input()
    public filterLabel = "";

    @Input()
    public filterDescription = "";

    @Input()
    public filterKey = ""

    @Input()
    public set items(value: any[]) {
        this._items = value;
        this.itemsSet$.next();
    }
    public get items(): any[] {
        return this._items;
    }
    private _items: any[] = [];
    private itemsSet$ = new Subject();

    @Output()
    public onEnter = new EventEmitter<string>()

    @ViewChild("virtualScroller")
    private virtualScroller: VirtualScrollerComponent | null = null;

    private _currentFilterValue: string = "";
    private onDestroy$ = new Subject();

    // Getter for parent components that need this value
    public get currentFilterValue(): string {
        return this._currentFilterValue;
    }

    // Getter for parent components that need this value to render the correct items
    public get filteredViewportItems(): any[] {
        return this.virtualScroller?.viewPortItems ?? [];
    }

    public formControl = new FormControl();
    public virtualScrollerHeight: number | null = null;
    public filteredItems$ = new BehaviorSubject<any[]>([]);

    public ngOnInit(): void {
        // in case items arrive async, we need to update filterItems accordingly
        this.itemsSet$.pipe(takeUntil(this.onDestroy$)).
            subscribe(_ => this.filteredItems$.next(this.filterItems(this.currentFilterValue)));
        // listen to changes of input field to filter items
        this.formControl.valueChanges.pipe(
            takeUntil(this.onDestroy$),
            startWith(this._currentFilterValue),
            tap(value => this._currentFilterValue = value)
        ).subscribe(value => this.filteredItems$.next(this.filterItems(value)));
        // set virtualScroller height when items change; use css values and paddings/margins
        this.filteredItems$.pipe(takeUntil(this.onDestroy$)).subscribe(items => {
            this.virtualScrollerHeight = (Math.ceil(items.length / 2) * (100 + 4)) + 8
        });
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    private filterItems(value: string): any[] {
        const filterValue = this.normalizeValue(value);
        // if a filter key is provided, use it to index the object to determine on which property to filter on
        return this.items.filter(item => this.normalizeValue(this.filterKey !== "" ? item[this.filterKey] : item).includes(filterValue));
    }

    private normalizeValue(value: string): string {
        return value.toLowerCase().replace(/\s/g, '');
    }
}
