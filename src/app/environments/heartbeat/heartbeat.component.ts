import { Component, OnInit, Input } from '@angular/core';
import { Build } from '../models/build.model';
import { BuildRecord } from '../models/build-record.model';
import { TfsEnvironmentService } from '../services/tfs-environment.service';

@Component({
    selector: 'hg-heartbeat',
    templateUrl: './heartbeat.component.html',
    styleUrls: ['./heartbeat.component.scss']
})
export class HeartbeatComponent implements OnInit {
    @Input() build: Build;
    buildData: BuildRecord;

    constructor(
        private tfsEnvironmentService: TfsEnvironmentService
    ) { }

    ngOnInit() {
        this.tfsEnvironmentService.getBuildTimeline(this.build).subscribe((data: BuildRecord) => {
            this.buildData = data;
        });
    }
}
