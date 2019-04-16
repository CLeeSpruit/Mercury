import { NgModule } from '@angular/core';

import { DynamicComponentService } from '@shared/services/dynamic-component.service';
import { QueryService } from '@shared/services/query.service';
import { ElectronService } from '@shared/services/electron.service';
import { ElectronViewDirective } from '@shared/directives/electronview.directive';
import { WebViewDirective } from '@shared/directives/webview.directive';
import { ExternalLinkDirective } from '@shared/directives/external-link.directive';
import { NotificationService } from '@shared/services/notification.service';
@NgModule({
    declarations: [
        ElectronViewDirective,
        WebViewDirective,
        ExternalLinkDirective
    ],
    providers: [
        DynamicComponentService,
        ElectronService,
        NotificationService
    ],
    exports: [
        ElectronViewDirective,
        WebViewDirective,
        ExternalLinkDirective
    ]
})
export class SharedModule { }
