import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorizationService } from '@auth/services/authorization.service';
import { ConfigService } from 'config/services/config.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'hg-navigation',
    styleUrls: ['navigation.component.scss'],
    templateUrl: 'navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {
    projectTitle = 'Mercury';

    private projectSub: Subscription = new Subscription();

    constructor(
        private configService: ConfigService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.projectSub = this.configService.getCurrentProject().subscribe(data => this.projectTitle = data);
    }

    ngOnDestroy() {
        this.projectSub.unsubscribe();
    }

    openSettings() {
        this.router.navigate(['settings']);
    }
}
