import { Component } from '@angular/core';

@Component({
    selector: 'hg-settings-modal',
    styleUrls: ['settings-modal.component.scss'],
    templateUrl: 'settings-modal.component.html'
})
export class SettingsModalComponent {
    componentRefDestroy: Function;

    constructor() { }

    close() {
        // TODO: Figure out why this isn't being destroyed
        // That which is dynamically created, must be dynamically destroyed
        // if (this.componentRefDestroy) {
        //     this.componentRefDestroy();
        // }

        window.location.reload();
    }
}
