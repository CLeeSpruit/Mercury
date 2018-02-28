import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnvironmentsComponent } from './environments.component';
import { HeartbeatComponent } from './heartbeat/heartbeat.component';
import { TfsEnvironmentService } from './services/tfs-environment.service';
import { ReleaseComponent } from './release/release.component';

@NgModule({
    declarations: [
        EnvironmentsComponent,
        HeartbeatComponent,
        ReleaseComponent
    ],
    imports: [CommonModule],
    providers: [TfsEnvironmentService],
    bootstrap: []
})
export class EnvironmentsModule { }
