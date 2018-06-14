import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from './services/config.service';
import { ProjectSelectComponent } from './project-select/project-select.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';

@NgModule({
    imports: [CommonModule],
    providers: [ConfigService],
    declarations: [
        ProjectSelectComponent,
        SettingsModalComponent
    ],
    entryComponents: [SettingsModalComponent]
})
export class ConfigModule { }
