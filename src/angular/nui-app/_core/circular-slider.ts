import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { fromEvent } from 'rxjs'
import { takeWhile, take } from 'rxjs/operators'

import { sleep } from '../../../angular-fivem-shared/utils';

@Component({
    selector: 'nui-circular-slider',
    template: `
        <div #container class="container">
            <div class="circle" [style.width.px]="2*radius" [style.height.px]="2*radius" [style.borderRadius.px]="radius"></div>
            <div #indicator class="indicator" (mousedown)="startDrag()" [style.left.px]="indicatorPosition.left" [style.top.px]="indicatorPosition.top"></div>
        </div>
  `,
    styles: [`
        .container{
            position: relative;
        }
        .circle{
            border: 1px solid silver;
        }
        .indicator {
            width: 24px;
            height: 24px;
            position: absolute;
            border-radius: 100px;
            background-color: lightgrey;
            color: white;
            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2);
        }
    `]
})
export class CircularSliderComponent implements AfterViewInit {
    @ViewChild('indicator') indicator!: ElementRef<HTMLElement>;
    @ViewChild('container') container!: ElementRef<HTMLElement>;

    @Input()
    public radius: number = 50;

    public indicatorPosition = { left: 0, top: 0};

    private origin = { x: this.radius, y: this.radius };
    private containerSize = { width: 0, height: 0 };
    private containerPosition = { x: 0, y: 0 };
    private isDragging = false;

    public async ngAfterViewInit() {
        await sleep();
        const { width, height } = this.indicator.nativeElement.getBoundingClientRect();
        const { x, y } = this.container.nativeElement.getBoundingClientRect();
        this.containerPosition = { x, y };
        this.containerSize = { width: width / 2, height: height / 2 };
        this.updateIndicatorPosition(this.radius, -this.radius);
        this.origin = { x: this.radius, y: this.radius };
    }

    private updateIndicatorPosition(posX: number, posY: number) {
        const angle = Math.atan2(posY, posX);
        const top = this.origin.y - this.containerSize.height + this.radius * Math.sin(angle);
        const left = this.origin.x - this.containerSize.width + this.radius * Math.cos(angle);
        this.indicatorPosition = { left, top};
    }

    public startDrag() {
        this.isDragging = true;
        fromEvent(document, 'mousemove').pipe(
            takeWhile(() => this.isDragging)
        ).subscribe((event: any) => {
            const mouseX = event.pageX - this.containerPosition.x - this.origin.x;
            const mouseY = event.pageY - this.containerPosition.y - this.origin.y;
            this.updateIndicatorPosition(mouseX, mouseY);
        })
        fromEvent(document, 'mouseup').pipe(take(1)).subscribe(_ => this.isDragging = false);
    }
}
