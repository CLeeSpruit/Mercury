import { NgModule } from '@angular/core';


import { DynamicComponentService } from '@shared/services/dynamic-component.service';
import { RichTextComponent } from '@shared/components/rich-text.component';

@NgModule({
    declarations: [ RichTextComponent ],
    providers: [DynamicComponentService],
    imports: [ EditorModule ]
})
export class SharedModule { }
