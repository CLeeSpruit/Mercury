import { NgModule } from '@angular/core';
import { DynamicComponentService } from '@shared/services/dynamic-component.service';

@NgModule({
    providers: [DynamicComponentService]
})
export class SharedModule { }
