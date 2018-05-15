import { Component } from '@angular/core';
import { AuthorizationService } from '../authorization/services/authorization.service';

@Component({
    selector: 'hg-navigation',
    styleUrls: ['navigation.component.scss'],
    templateUrl: 'navigation.component.html'
})
export class NavigationComponent {
    constructor(private authService: AuthorizationService) { }

    logout() {
        this.authService.logout();
        window.location.reload();
    }
}
