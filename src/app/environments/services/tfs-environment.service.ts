
import { throwError as observableThrowError, Observable, AsyncSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Build } from '../models/build.model';
import { Release } from '../models/release.model';
import { Artifact } from '../models/artifact.model';
import { ReleaseRequest } from '../models/release-request.model';
import { BuildDefinition } from '../models/build-definition.model';
import { ReleaseDefinition } from '../models/release-definition.model';
import { ConfigService } from 'config/services/config.service';


@Injectable()
export class TfsEnvironmentService {
    private baseProjectLocation: string;
    private apiReady: AsyncSubject<boolean> = new AsyncSubject<boolean>();

    private options = {
        headers: new HttpHeaders({
            'cache-control': 'no-cache',
            'Content-Type': 'application/json'
        })
    };

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) { }

    init() {
        this.configService.getProjectApiUrl().subscribe(url => {
            this.baseProjectLocation = url;
            this.apiReady.next(true);
            this.apiReady.complete();
        });
    }

    getBuilds(): Observable<Array<Build>> {
        return this.http.get(`${this.baseProjectLocation}/build/builds`, this.options).pipe(
            map((response: any) => {
                const builds: Array<Build> = response.value;
                return builds.map((build) => {
                    build.finishTime = new Date(build.finishTime);
                    build.startTime = new Date(build.startTime);
                    build.queueTime = new Date(build.queueTime);
                    build.dropdownName = build.buildNumber;
                    if (build.sourceBranch) {
                        build.dropdownName += ` - ${this.parseBranch(build.sourceBranch)}`;
                    }
                    if (build.requestedFor && build.requestedFor.displayName) {
                        build.dropdownName += ` - ${build.requestedFor.displayName}`;
                    }
                    if (build.finishTime) {
                        build.dropdownName += ` - ${build.finishTime.toLocaleDateString()}`;
                    }
                    return build;
                });
            }), catchError(this.handleError));
    }

    private parseBranch(sourceBranch: string) {
        if (!sourceBranch) { return ''; }
        // zalgo he comes
        let matches = sourceBranch.match(new RegExp(/(?:refs\/pull\/)(\d+)(?:\/merge)/));
        // PR build
        if (matches) { return matches[1]; }
        // branch build (usually dev or itp)
        matches = sourceBranch.match(new RegExp(/(?:refs\/heads\/)(\w+)/));
        return matches ? matches[1] : '';
    }

    // Not used
    getBuildTimeline(build: Build) {
        return this.http.get(`${this.baseProjectLocation}/build/builds/${build.id}/timeline`, this.options);
    }

    getBuildDefinitions(): Observable<Array<BuildDefinition>> {
        return this.http.get(`${this.baseProjectLocation}/build/definitions`, this.options).pipe(map(this.getValue));
    }

    getReleases(): Observable<Array<Release>> {
        return this.http.get(`${this.baseProjectLocation}/release/releases`, this.options).pipe(map(this.getValue));
    }

    getReleaseDetails(release: Release): Observable<Release> {
        return this.http.get(`${this.baseProjectLocation}/release/releases/${release.id}`, this.options).pipe(
            map((response: any | Release) => {
                const artifact = <Artifact>{};
                if (response.artifacts && response.artifacts[0] && response.artifacts[0].definitionReference) {
                    if (response.artifacts[0].definitionReference.version) {
                        artifact.versionId = response.artifacts[0].definitionReference.version.id;
                        artifact.versionName = response.artifacts[0].definitionReference.version.name;
                    }

                    if (response.artifacts[0].definitionReference.branch) {
                        artifact.branchId = response.artifacts[0].definitionReference.branch.id;
                        artifact.branchName = response.artifacts[0].definitionReference.branch.name;
                    }
                }

                response.createdOn = new Date(response.createdOn);
                response.modifiedOn = new Date(response.modifiedOn);
                return <Release>{
                    ...response,
                    artifact
                };

            }));
    }

    getReleaseDefinitions(): Observable<Array<ReleaseDefinition>> {
        return this.http.get(`${this.baseProjectLocation}/release/definitions`, this.options)
            .pipe(map((res: any) => {
                return res.value;
            }));
    }

    createRelease(build: Build, definition: ReleaseDefinition) {
        return this.http
            .post(
                `${this.baseProjectLocation}/release/releases?api-version=2.2-preview.1`,
                JSON.stringify(this.createReleaseRequest(build, definition)),
                this.options).pipe(
            map(this.getValue));
    }

    // TODO: Write a response handler
    private handleError(error: Response | any, caught: Observable<any>) {
        return observableThrowError(error);
    }

    private createReleaseRequest(build: Build, definition: ReleaseDefinition) {
        return <ReleaseRequest>{
            definitionId: definition.id,
            description: 'Mercury Task Manager',
            artifacts: [
                {
                    alias: definition.name,
                    instanceReference: {
                        name: build.buildNumber,
                        id: build.id.toString(),
                        sourceBranch: build.sourceBranch,
                        sourceVersion: build.sourceVersion,
                        sourceRepositoryId: '27b5dc0b-2b13-49e9-b443-bde560692509', // TODO: Don't hardcode this
                        sourceRepositoryType: 'TfsGit'
                    }
                }
            ],
            isDraft: false,
            manualEnvironments: []
        };
    }

    private getValue(res: any) {
        return res.value;
    }
}
