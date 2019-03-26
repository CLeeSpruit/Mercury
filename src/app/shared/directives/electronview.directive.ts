/* This is an over-glorified ngIf="isElectron". It's counterpart is the WebViewDirective. */

import { Directive, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { ElectronService } from '@shared/services/electron.service';

@Directive({
    selector: '[hgElectron]'
})
export class ElectronViewDirective implements OnInit {
    constructor(
        private electronService: ElectronService,
        private templateRef: TemplateRef<any>,
        private vcr: ViewContainerRef
    ) {
        //
    }

    ngOnInit() {
        if (this.electronService.isElectron) {
            this.vcr.createEmbeddedView(this.templateRef);
        } else {
            this.vcr.clear();
        }
    }
}
