import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnvironmentsComponent } from './environments.component';
import { HeartbeatComponent } from './heartbeat/heartbeat.component';
import { TfsEnvironmentService } from './services/tfs-environment.service';
import { HeartbeatCommService } from '@environments/services/heartbeat-comm.service';
import { BuildMonitorService } from '@environments/services/build-monitor.service';

@NgModule({
    declarations: [
        EnvironmentsComponent,
        HeartbeatComponent
    ],
    imports: [CommonModule],
    providers: [
        TfsEnvironmentService,
        HeartbeatCommService,
        BuildMonitorService
    ],
    bootstrap: []
})
export class EnvironmentsModule { }
