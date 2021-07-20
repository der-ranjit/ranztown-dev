import { Injectable, OnInit } from "@angular/core";
/**
 * Needed for Custom NuiMessage Decorator
 * To be able to make decorators work in Angular DI managed services, we need some method that is guaranteed to be
 * fired, so we can hook into it and setup decorator logic.
 * Unfortunately the constructor cannot be used, since overwriting the constructor will break Angular DI magic.
 * As a workaround all Services should extend from this service.
 */
// https://github.com/angular/angular/issues/30497
@Injectable()
export abstract class BaseNuiService implements OnInit {
    constructor() {
        this.ngOnInit();
    }
    public ngOnInit() {}
}
