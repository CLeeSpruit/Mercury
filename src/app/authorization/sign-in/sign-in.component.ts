import { Component } from '@angular/core';
import { AuthorizationService } from '../services/authorization.service';

@Component({
    selector: 'hg-sign-in',
    templateUrl: 'sign-in.component.html'
})
export class SignInComponent {
    constructor(private authService: AuthorizationService) {

    }

    signIn(authKey: string) {
        this.authService.authorize(authKey);

        // If successful, navigate to dashboard
        // TODO: Navigate to last page
    }
}
