import { NgModule } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';

import { DynamicComponentService } from '@shared/services/dynamic-component.service';
import { RichTextComponent } from '@shared/components/rich-text/rich-text.component';

@NgModule({
    declarations: [
        RichTextComponent
    ],
    providers: [DynamicComponentService],
    imports: [
        EditorModule,
        FormsModule
    ],
    exports: [
        RichTextComponent
    ]
})
export class SharedModule { }
