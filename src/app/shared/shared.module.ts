import { NgModule } from '@angular/core';

import { DynamicComponentService } from '@shared/services/dynamic-component.service';
import { QueryService } from '@shared/services/query.service';
import { ElectronService } from '@shared/services/electron.service';
@NgModule({
    providers: [
        DynamicComponentService,
        ElectronService
    ]
})
export class SharedModule { }
