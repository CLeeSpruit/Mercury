import { TfsEnvironmentService } from '@environments/services/tfs-environment.service';
import { Injectable } from '@angular/core';
import { ElectronService } from '@shared/services/electron.service';
import { NotificationService } from '@shared/services/notification.service';
import { Observable, interval, BehaviorSubject, Subscription } from 'rxjs';
import { startWith, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Build } from '@environments/models/build.model';
import { Release } from '@environments/models/release.model';
import { ConfigService } from 'config/services/config.service';

/* This service should init with app if it is electron */

@Injectable()
export class BuildMonitorService {
    private interval: number;
    private builds: BehaviorSubject<Array<Build>> = new BehaviorSubject(new Array<Build>());
    private releases: BehaviorSubject<Array<Release>> = new BehaviorSubject(new Array<Release>());
    private buildInterval: Subscription = new Subscription();
    private releaseInterval: Subscription = new Subscription();

    constructor(
        private tfsEnvironmentService: TfsEnvironmentService,
        private electronService: ElectronService,
        private notificationService: NotificationService,
        private configService: ConfigService
    ) {
        //
    }

    init() {
        this.configService.getBuildSettings().subscribe(buildConfig => {
            const configOrDefaultInterval = buildConfig.buildMonitorInterval || 30; // Thirty seconds default
            this.interval = configOrDefaultInterval * 1000;
            this.buildInterval.unsubscribe();
            this.releaseInterval.unsubscribe();

            if (buildConfig.notificationsOn) {
                this.initMonitor();
            }
        });
    }

    private initMonitor() {
        // Builds
        interval(this.interval).pipe(startWith(0), switchMap(() => {
            return this.tfsEnvironmentService.getBuilds();
        })).subscribe(val => {
            console.log(val);
            const notifyBuildsFor = new Array<Build>();
            const currentBuilds = this.builds.getValue();
            if (currentBuilds && currentBuilds.length) {
                // Check if there are builds are completed
                const updatedBuilds = val.filter(updatedBuild => {
                    if (updatedBuild.status !== 'completed') { return false; }
                    const existingBuild = currentBuilds.find(curr => curr.id === updatedBuild.id);
                    return existingBuild.status !== updatedBuild.status;
                });
                notifyBuildsFor.push(...updatedBuilds);

                // Check for new builds
                if (currentBuilds.length < val.length) {
                    const newBuilds = val.filter(newBuild => !currentBuilds.find(curr => curr.id === newBuild.id) && newBuild.status === 'completed');
                    notifyBuildsFor.push(...newBuilds);
                }

                this.notifyBuilds(notifyBuildsFor);
            }

            this.builds.next(val);
        });

        // Releases
        interval(this.interval).pipe(startWith(0), switchMap(() => {
            return this.tfsEnvironmentService.getReleases();
        })).subscribe(val => {
            console.log(val);
            const notifyReleasesFor = new Array<Release>();
            const currentReleases = this.releases.getValue();
            if (this.releases) {
                // Check if there are new builds being compelted
                currentReleases.forEach(release => {
                    const newRelease = val.find(newRel => newRel.id === release.id);
                    if (newRelease.status !== newRelease.status && newRelease.status === 'active') {
                        notifyReleasesFor.push(newRelease);
                    }
                });

                this.notifyReleases(notifyReleasesFor);
            }

            this.releases.next(val);
        });
    }

    private notifyBuilds(builds: Array<Build>) {
        if (!builds || !builds.length) { return; }
        let title: string, message: string;

        if (builds.length > 1) {
            title = 'Builds Complete';
            message = 'Build for ' + builds[0].definition.name + ' is complete, along with ' + (builds.length - 1) + ' other builds.';
        } else {
            title = 'Build Complete for ' + builds[0].definition.name;
            message = 'Build for ' + builds[0].definition.name + ' is complete. It was probably successful.';
        }

        this.notificationService.sendNotification(title, message);
    }

    private notifyReleases(releases: Array<Release>) {
        if (!releases || !releases.length) { return; }
        let title: string, message: string;

        if (releases.length > 1) {
            title = 'Release Finished';
            message = 'Release for ' + releases[0].name + ' is complete, along with ' + (releases.length - 1) + ' other releases.';
        } else {
            title = 'Release Finished for ' + releases[0].name;
            message = 'Releases for ' + releases[0].name + ' is complete. It was probably successful.';
        }

        this.notificationService.sendNotification(title, message);
    }

    getBuilds(): Observable<Array<Build>> {
        return this.builds.asObservable().pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
    }

    getReleases(): Observable<Array<Release>> {
        return this.releases.asObservable().pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
    }
}
