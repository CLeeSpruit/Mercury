import { Component, Input } from '@angular/core';

@Component({
    selector: 'hg-rich-text',
    templateUrl: 'rich-text.component.html'
})
export class RichTextComponent {
    @Input() field: string;
    tinySettings: any;

    constructor() {
        // Initialize the app
        this.tinySettings = {
            branding: false
        };
    }
}
