import { Component, OnInit, Input } from '@angular/core';
import { TfsEnvironmentService } from '../services/tfs-environment.service';
import { Deployment } from '../models/deployment.model';
import { HeartbeatCommService } from '@environments/services/heartbeat-comm.service';

@Component({
    selector: 'hg-heartbeat',
    templateUrl: './heartbeat.component.html',
    styleUrls: ['./heartbeat.component.scss']
})
export class HeartbeatComponent implements OnInit {
    @Input() deployment: Deployment;
    @Input() buildList: Array<string> = new Array<string>();
    expanded = false;

    constructor(
        private tfsEnvironmentService: TfsEnvironmentService,
        private heartbeatCommService: HeartbeatCommService
    ) { }

    ngOnInit() {
        if (this.deployment && this.deployment.settings) {
            this.expanded = this.deployment.settings.favorite;
        }
        // this.tfsEnvironmentService.getBuildTimeline(this.build).subscribe((data: BuildRecord) => {
        //     this.buildData = data;
        // });
    }

    startRelease(buildId: number) {
        const found = this.deployment.applicableBuilds.find(build => build.id === +buildId);
        this.tfsEnvironmentService.createRelease(found, this.deployment.release.releaseDefinition).subscribe((data) => {});
    }

    toggleView() {
        this.expanded = !this.expanded;
    }

    toggleFavorite() {
        this.heartbeatCommService.toggleFavorite(this.deployment.release.releaseDefinition.name);
    }

    selectBuild(associatedBuild: string) {
        this.heartbeatCommService.setAssociatedBuild(this.deployment.release.releaseDefinition.name, associatedBuild);
    }

    deassociateBuild() {
        this.heartbeatCommService.removeAssociatedBuild(this.deployment.release.releaseDefinition.name);
    }
}
