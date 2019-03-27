import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, AsyncSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Build } from './models/build.model';
import { TfsEnvironmentService } from './services/tfs-environment.service';
import { BuildDefinition } from './models/build-definition.model';
import { Release } from './models/release.model';
import { ReleaseDefinition } from './models/release-definition.model';
import { Deployment } from './models/deployment.model';
import { HeartbeatSettings } from '@environments/models/heartbeat-settings.model';
import { HeartbeatCommService } from '@environments/services/heartbeat-comm.service';
import { ElectronService } from '@shared/services/electron.service';

@Component({
    selector: 'hg-environments',
    templateUrl: './environments.component.html',
    styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit, OnDestroy {
    mostRecentBuilds: Array<Build> = new Array<Build>();
    private buildDefinitions: Array<BuildDefinition> = new Array<BuildDefinition>();
    private buildsSubject: BehaviorSubject<Array<Build>> = new BehaviorSubject<Array<Build>>(null);

    mostRecentReleases: Array<Release> = new Array<Release>();
    private releaseDefinitions: Array<ReleaseDefinition> = new Array<ReleaseDefinition>();

    deployments: Array<Deployment> = new Array<Deployment>();
    buildList: Array<string> = new Array<string>();

    private settingsList: Array<HeartbeatSettings> = new Array<HeartbeatSettings>();
    private settingsSub: Subscription = new Subscription();

    constructor(
        private tfsEnvironmentService: TfsEnvironmentService,
        private heartbeatCommService: HeartbeatCommService,
        private electronService: ElectronService
    ) { }

    ngOnInit() {
        this.tfsEnvironmentService.getBuilds().subscribe((data: Array<Build>) => {
            // Let the set deployment know it can trigger
            this.buildsSubject.next(data);

            this.tfsEnvironmentService.getBuildDefinitions().subscribe((definitionData: Array<BuildDefinition>) => {
                this.buildDefinitions = definitionData;
                this.buildList = this.buildDefinitions.map(def => def.name);
                this.mostRecentBuilds = this.getMostRecentBuilds(data);
                this.reinstanceDeployments();
            });
        });

        this.tfsEnvironmentService.getReleases().subscribe((data: Array<Release>) => {
            this.tfsEnvironmentService.getReleaseDefinitions().subscribe((definitionData: Array<ReleaseDefinition>) => {
                this.releaseDefinitions = definitionData;
                this.mostRecentReleases = this.getMostRecentReleases(data);
            });
        });

        if (this.electronService.isElectron()) {
            this.settingsList = this.heartbeatCommService.getSettings();
            this.settingsSub = this.heartbeatCommService.getSettingsChangedEvent().subscribe(() => {
                this.reinstanceDeployments();
            })
        }
    }

    ngOnDestroy() {
        this.settingsSub.unsubscribe();
    }

    private reinstanceDeployments() {
        const allDeploymentsSet = new AsyncSubject();
        allDeploymentsSet.subscribe(() => {
            // Currently sort alphabetically
            // TODO: Sort by priority between favorite and alpha
            this.deployments = this.deployments.sort((a, b) => {
                const aFav = a.settings && a.settings.favorite;
                const bFav = b.settings && b.settings.favorite;

                if (!aFav && bFav) {
                    return 1;
                }
                if (aFav && !bFav) {
                    return -1;
                }
                if (aFav === bFav) {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (b.name < a.name) {
                        return -1;
                    }
                }
                return 0;
            });
        });
        let count = 0;
        this.mostRecentReleases.forEach((release: Release) => {
            this.tfsEnvironmentService.getReleaseDetails(release).subscribe((releaseFull: Release) => {
                this.setDeployment(releaseFull);
                count++;
                if (count >= this.mostRecentReleases.length) {
                    allDeploymentsSet.next(null);
                    allDeploymentsSet.complete();
                }
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

    private setDeployment(release: Release) {
        if (!release) {
            return;
        }

        // Wait until builds have been queried
        this.buildsSubject.pipe(filter(builds => !!builds)).subscribe((builds: Array<Build>) => {
            this.populateDeployments(release, builds);
        });
    }

    private populateDeployments(release: Release, builds: Array<Build>) {
        const name = release.releaseDefinition.name;
        const newDeployment: Deployment = <Deployment>{
            name,
            release
        };
        // Get settings for deployment
        if (this.settingsList && this.settingsList.length) {

            const settings: HeartbeatSettings = this.settingsList.find(setting => setting.releaseName === name);
            if (settings && settings.associatedBuildName) {
                newDeployment.settings = settings;

                // Get applicable builds
                const applicableBuilds = builds.filter(buildListItem => buildListItem.definition.name === name);
                newDeployment.applicableBuilds = applicableBuilds;

                // Get latest build
                if (applicableBuilds.length) {
                    const latestBuild = applicableBuilds.reduce((acc: Build, curr: Build) => {
                        if (acc.queueTime > curr.queueTime) {
                            return acc;
                        } else {
                            return curr;
                        }
                    });
                    newDeployment.build = latestBuild;
                }
            }
        }

        const index = this.deployments.findIndex(deploy => deploy.name === newDeployment.name);
        if (index !== -1) {
            // TODO: Make a comm service for deployments
            const newArr = new Array(...this.deployments);
            newArr[index] = newDeployment;
            this.deployments = newArr;
        } else {
            this.deployments.push(newDeployment);
        }
    }
}
