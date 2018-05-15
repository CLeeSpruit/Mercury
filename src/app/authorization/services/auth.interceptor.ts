import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthorizationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        const token = this.authService.getAuthorization();

        const newRequest = request.clone({
            headers: request.headers.set('authorization', `Basic ${token}`)
        });

        return next.handle(newRequest);
    }
}
