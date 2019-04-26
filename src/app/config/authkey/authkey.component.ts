import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '@auth/services/authorization.service';

@Component({
    selector: 'hg-authkey',
    styleUrls: ['authkey.component.scss'],
    templateUrl: 'authkey.component.html'
})
export class AuthkeyComponent implements OnInit {
    isHidden = true;
    token: string;

    constructor(private authService: AuthorizationService) {
        //
    }

    ngOnInit() {
        this.token = this.authService.readAuthorization();
    }

    saveToken(token: string) {
        this.authService.authorize(token);
    }

    showKey() {
        this.isHidden = false;
    }

    logout() {
        this.authService.logout();
        window.location.reload();
    }
}
