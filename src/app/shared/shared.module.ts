import { NgModule } from '@angular/core';

import { DynamicComponentService } from '@shared/services/dynamic-component.service';
import { QueryService } from '@shared/services/query.service';
@NgModule({
    providers: [
        DynamicComponentService
    ]
})
export class SharedModule { }
