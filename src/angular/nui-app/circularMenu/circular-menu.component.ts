import { Component, OnInit } from '@angular/core';

import { slideIn } from '../_core/animations';

declare const wheelnav: any;

@Component({
    selector: 'nui-app-circular-menu',
    template: `
        <div class="circularMenuContainer">
            <div id="wheelDiv" style="width:300px"></div>
        </div>
`,
    styles: [`
        :host {

        }

    `],
    animations: [
        slideIn
    ]
})
export class CircularMenuComponent implements OnInit {

    ngOnInit() {

        // create wheelnav
        // the div is in the template
        let wheel = new wheelnav("wheelDiv");
        wheel.initWheel(["init", "create", "navigate", "refresh"]);
        wheel.createWheel();
      }
}
