import { Component, Input } from '@angular/core';
import { Change } from '../models/change.class';

@Component({
    selector: 'hg-change',
    templateUrl: 'change.component.html',
    styleUrls: ['change.component.scss']
})
export class ChangeComponent {
    @Input() change: Change;
}
