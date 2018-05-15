import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthorizationService } from './services/authorization.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
    declarations: [
        SignInComponent
    ],
    imports: [
        HttpClientModule,
        CommonModule,
        HttpClientModule
    ],
    providers: [
        AuthorizationService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    entryComponents: [
        SignInComponent
    ]
})
export class AuthorizationModule { }
