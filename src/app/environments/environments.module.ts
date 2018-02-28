import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnvironmentsComponent } from './environments.component';
import { HeartbeatComponent } from './heartbeat/heartbeat.component';
import { TfsEnvironmentService } from './services/tfs-environment.service';

@NgModule({
    declarations: [
        EnvironmentsComponent,
        HeartbeatComponent
    ],
    imports: [CommonModule],
    providers: [TfsEnvironmentService],
    bootstrap: []
})
export class EnvironmentsModule { }
