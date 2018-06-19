import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'hg-settings-modal',
    styleUrls: ['settings-modal.component.scss'],
    templateUrl: 'settings-modal.component.html'
})
export class SettingsModalComponent {
    componentRefDestroy: Function;

    constructor(private router: Router) { }

    close() {
        // TODO: Figure out why this isn't being destroyed
        // That which is dynamically created, must be dynamically destroyed
        // if (this.componentRefDestroy) {
        //     this.componentRefDestroy();
        // }

        window.location.reload();
    }

    navigateChangelog() {
        this.router.navigate(['about']);
        this.close();
    }
}
