import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SignInComponent } from './sign-in/sign-in.component';
import { AuthorizationService } from './services/authorization.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [
        SignInComponent
    ],
    imports: [
        HttpClientModule,
        CommonModule,
        HttpClientModule,
        SharedModule
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
