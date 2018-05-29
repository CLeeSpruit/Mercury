import { Component, ComponentRef } from '@angular/core';
import { AuthorizationService } from '../services/authorization.service';

@Component({
    selector: 'hg-sign-in',
    templateUrl: 'sign-in.component.html',
    styleUrls: ['sign-in.component.scss']
})
export class SignInComponent {
    expandInfo = false;
    componentRefDestroy: Function;

    constructor(private authService: AuthorizationService) { }

    signIn(authKey: string) {
        this.authService.authorize(authKey);
        this.close();
    }

    toggleExpand() {
        this.expandInfo = !this.expandInfo;
    }

    close() {
        // TODO: Figure out why this isn't being destroyed
        // That which is dynamically created, must be dynamically destroyed
        // if (this.componentRefDestroy) {
        //     this.componentRefDestroy();
        // }

        window.location.reload();
    }
}
