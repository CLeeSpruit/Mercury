/* This is an over-glorified ngIf="!isElectron". It's counterpart is the ElectronViewDirective. */

import { Directive, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { ElectronService } from '@shared/services/electron.service';

@Directive({
    selector: '[hgWeb]'
})
export class WebViewDirective implements OnInit {
    constructor(
        private electronService: ElectronService,
        private templateRef: TemplateRef<any>,
        private vcr: ViewContainerRef
    ) {
        //
    }

    ngOnInit() {
        if (!this.electronService.isElectron) {
            this.vcr.createEmbeddedView(this.templateRef);
        } else {
            this.vcr.clear();
        }
    }
}
