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

    navigateChangelog() {
        this.router.navigate(['about']);
    }
}
