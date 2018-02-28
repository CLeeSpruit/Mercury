import { Component, OnInit } from '@angular/core';
import { Build } from './models/build.model';
import { TfsEnvironmentService } from './services/tfs-environment.service';
import { BuildDefinition } from './models/build-definition.model';
import { Release } from './models/release.model';
import { ReleaseDefinition } from './models/release-definition.model';

@Component({
    selector: 'hg-environments',
    templateUrl: './environments.component.html',
    styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {
    mostRecentBuilds: Array<Build> = new Array<Build>();
    private builds: Array<Build> = new Array<Build>();
    private buildDefinitions: Array<BuildDefinition> = new Array<BuildDefinition>();

    mostRecentReleases: Array<Release> = new Array<Release>();
    private releases: Array<Release> = new Array<Release>();
    private releaseDefinitions: Array<ReleaseDefinition> = new Array<ReleaseDefinition>();

    constructor(
        private tfsEnvironmentService: TfsEnvironmentService
    ) { }

    ngOnInit() {
        this.tfsEnvironmentService.getBuilds().subscribe((data: Array<Build>) => {
            this.builds = data;
            this.tfsEnvironmentService.getBuildDefinitions().subscribe((definitionData: Array<BuildDefinition>) => {
                this.buildDefinitions = definitionData;
                this.mostRecentBuilds = this.getMostRecentBuilds(data);
            });
        });

        this.tfsEnvironmentService.getReleases().subscribe((data: Array<Release>) => {
            this.releases = data;
            this.tfsEnvironmentService.getReleaseDefinitions().subscribe((definitionData: Array<ReleaseDefinition>) => {
                this.releaseDefinitions = definitionData;
                this.mostRecentReleases = this.getMostRecentReleases(data);
            });
        });
    }

    private getMostRecentBuilds(builds: Array<Build>): Array<Build> {
        return this.buildDefinitions
            .map(def => builds.find(build => build.definition.name === def.name))
            .filter(build => build); // Remove undefined
    }

    private getMostRecentReleases(releases: Array<Release>): Array<Release> {
        return this.releaseDefinitions
            .map(def => releases.find(release => release.releaseDefinition.name === def.name))
            .filter(release => release); // Remove undefined
    }
}
