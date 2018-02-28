import { Component, OnInit, Input } from '@angular/core';
import { TfsEnvironmentService } from '../services/tfs-environment.service';
import { Deployment } from '../models/deployment.model';
import { Build } from '../models/build.model';

@Component({
    selector: 'hg-heartbeat',
    templateUrl: './heartbeat.component.html',
    styleUrls: ['./heartbeat.component.scss']
})
export class HeartbeatComponent implements OnInit {
    @Input() deployment: Deployment;

    constructor(
        private tfsEnvironmentService: TfsEnvironmentService
    ) { }

    ngOnInit() {
        // this.tfsEnvironmentService.getBuildTimeline(this.build).subscribe((data: BuildRecord) => {
        //     this.buildData = data;
        // });
    }

    startRelease(buildId: number) {
        const found = this.deployment.applicableBuilds.find(build => build.id === +buildId);
        this.tfsEnvironmentService.createRelease(found, this.deployment.release.releaseDefinition).subscribe((data) => {});
    }
}
