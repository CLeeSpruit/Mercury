
import {throwError as observableThrowError } from 'rxjs';
import { Injectable, ComponentRef } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

import { ConfigService } from './config.service';
import { Router } from '@angular/router';

@Injectable()
export class ConfigInterceptor implements HttpInterceptor {
    constructor(
        private configService: ConfigService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.configService.hasCurrentProject() && !request.url.includes(this.configService.getApiUrl())
        ) {
            this.createSettingsModal();
            return observableThrowError('No project found. Please select one from the settings dropdown');
        }

        return next.handle(request);
    }

    private createSettingsModal() {
        this.router.navigate(['settings']);
    }
}
