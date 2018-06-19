import { NgModule } from '@angular/core';
import { MetaModalComponent } from './meta-modal/meta-modal.component';
import { CommonModule } from '@angular/common';
import { ChangeComponent } from './change/change.component';
import { MetaService } from './services/meta.service';

@NgModule({
    declarations: [
        MetaModalComponent,
        ChangeComponent
    ],
    providers: [MetaService],
    imports: [CommonModule]
})
export class MetaModule { }