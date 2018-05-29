import { Component, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { DynamicComponentService } from '@shared/services/dynamic-component.service';

@Component({
    selector: 'hg-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    @ViewChild('insertPoint', { read: ViewContainerRef}) dynamicInsert: ViewContainerRef;

    constructor(private dynamicComponentService: DynamicComponentService) { }

    ngAfterViewInit() {
        this.dynamicComponentService.setRootContainer(this.dynamicInsert);
    }
}
