// Shamelessly borrowed from Opus' dynamic component service, with some extras
import {
    Injectable,
    Injector,
    ComponentFactoryResolver,
    ComponentFactory,
    ViewContainerRef,
    ComponentRef
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import 'rxjs/add/operator/filter';

@Injectable()
export class DynamicComponentService {
    private componentList: Array<any> = new Array<any>();
    private rootContainerSubject: BehaviorSubject<ViewContainerRef> = new BehaviorSubject<ViewContainerRef>(null);
    private componentSubject: AsyncSubject<ComponentRef<any>> = new AsyncSubject<ComponentRef<any>>();

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ) { }

    addComponent(component: any): Observable<ComponentRef<any>> {
        // Wait until the root viewContainerRef is not null
        this.rootContainerSubject.filter(vcr => !!vcr).subscribe((vcr: ViewContainerRef) => {
            // Generate a factory to create specified component
            const factory: ComponentFactory<{}> = this.componentFactoryResolver.resolveComponentFactory(component);

            // Insert into DOM as the last element, returns a reference to the component created
            this.componentSubject.next(vcr.createComponent(factory));
            // Close this out since it's finished
            this.componentSubject.complete();
        });

        return this.componentSubject;
    }

    // A ViewContainerRef is required to anchor the dynamic component somewhere
    setRootContainer(rootContainerRef: ViewContainerRef) {
        this.rootContainerSubject.next(rootContainerRef);
    }
}
