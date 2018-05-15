import { Injectable, ComponentRef } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthorizationService } from './authorization.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { DynamicComponentService } from '../../services/dynamic-component.service';
import { SignInComponent } from '../sign-in/sign-in.component';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthorizationService,
        private dynamicComponentService: DynamicComponentService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        const token = this.authService.getAuthorization();
        if (!token) {
            this.createAuthModal();
            return Observable.throw('No authorization found. You need to get an Personal Access Token from TFS');
        }

        const newRequest = request.clone({
            headers: request.headers.set('authorization', `Basic ${token}`)
        });

        return next.handle(newRequest);
    }

    private createAuthModal() {
        // TODO: Add a modal wrapper if needed
        this.dynamicComponentService.addComponent(SignInComponent).subscribe((comp: ComponentRef<SignInComponent>) => {
            comp.instance.componentRefDestroy = comp.destroy;
            comp.changeDetectorRef.detectChanges();
        });
    }
}
