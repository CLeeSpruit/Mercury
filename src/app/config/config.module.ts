import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { ProjectSelectComponent } from './project-select/project-select.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { ConfigInterceptor } from './services/config.interceptor';
import { AuthkeyComponent } from 'config/authkey/authkey.component';
import { StyleConfigComponent } from 'config/style-config/style-config.component';
import { NotificationSettingsComponent } from 'config/notification-settings/notification-settings.component';

@NgModule({
    imports: [CommonModule],
    providers: [
        ConfigService,
        { provide: HTTP_INTERCEPTORS, useClass: ConfigInterceptor, multi: true }
    ],
    declarations: [
        ProjectSelectComponent,
        SettingsModalComponent,
        AuthkeyComponent,
        StyleConfigComponent,
        NotificationSettingsComponent
    ],
    entryComponents: [SettingsModalComponent]
})
export class ConfigModule { }
