
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable, ComponentRef } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';


import { ConfigService } from './config.service';

@Injectable()
export class ConfigInterceptor implements HttpInterceptor {
    constructor(
        private configService: ConfigService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.configService.hasCurrentProject() &&
            !request.url.includes(this.configService.getApiUrl())
        ) {
            this.createSettingsModal();
            return observableThrowError('No project found. Please select one from the settings dropdown');
        }

        return next.handle(request);
    }

    private createSettingsModal() {
        this.configService.openSettingsModal();
    }
}
