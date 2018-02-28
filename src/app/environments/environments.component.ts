import { Component, OnInit } from '@angular/core';
import { Build } from './models/build.model';
import { TfsEnvironmentService } from './services/tfs-environment.service';
import { BuildDefinition } from './models/build-definition.model';
import { Release } from './models/release.model';
import { ReleaseDefinition } from './models/release-definition.model';
import { Deployment } from './models/deployment.model';

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

    deployments: Array<Deployment> = new Array<Deployment>();

    constructor(
        private tfsEnvironmentService: TfsEnvironmentService
    ) { }

    ngOnInit() {
        this.tfsEnvironmentService.getBuilds().subscribe((data: Array<Build>) => {
            this.builds = data;
            this.tfsEnvironmentService.getBuildDefinitions().subscribe((definitionData: Array<BuildDefinition>) => {
                this.buildDefinitions = definitionData;
                this.mostRecentBuilds = this.getMostRecentBuilds(data);
                this.mostRecentBuilds.forEach(build => this.setDeployment(build));
            });
        });

        this.tfsEnvironmentService.getReleases().subscribe((data: Array<Release>) => {
            this.releases = data;
            this.tfsEnvironmentService.getReleaseDefinitions().subscribe((definitionData: Array<ReleaseDefinition>) => {
                this.releaseDefinitions = definitionData;
                this.mostRecentReleases = this.getMostRecentReleases(data);
                this.mostRecentReleases.forEach((release: Release) => {
                    this.tfsEnvironmentService.getReleaseDetails(release).subscribe((releaseFull: Release) => {
                        release = releaseFull;
                        this.setDeployment(null, release);
                    });
                });
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

    private setDeployment(build?: Build, release?: Release) {
        if (!build && !release) {
            return;
        }

        const name = build ? build.definition.name : release.releaseDefinition.name;
        const applicableBuilds = this.builds.filter(buildListItem => buildListItem.definition.name === name);
        const foundIndex = this.deployments.findIndex(deploy => deploy.name === name);

        if (foundIndex !== -1) {
            if (build) {
                this.deployments[foundIndex].build = build;
            } else {
                this.deployments[foundIndex].release = release;
                this.deployments[foundIndex].applicableBuilds = applicableBuilds;
            }
        } else {
            const newDeployment: Deployment = <Deployment>{
                name,
                build,
                release,
                applicableBuilds
            };

            this.deployments.push(newDeployment);
        }
    }
}
