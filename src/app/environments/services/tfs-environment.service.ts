import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Build } from '../models/build.model';
import { Release } from '../models/release.model';
import { Artifact } from '../models/artifact.model';
import { ReleaseRequest, ReleaseArtifact } from '../models/release-request.model';
import { BuildDefinition } from '../models/build-definition.model';
import { ReleaseDefinition } from '../models/release-definition.model';

@Injectable()
export class TfsEnvironmentService {
    // TODO: Don't hard code this.
    private baseLocationGeneric = 'http://tfs2013-mn:8080/tfs/DefaultCollection/_apis/';
    private baseLocationOpus = 'http://tfs2013-mn:8080/tfs/DefaultCollection/OPUS/_apis/';
    // TODO: Especially this
    private accessCode = this.createAuthorization('lpinsks2xb6nhvw6fxn2474koaq3l5647bg7lkikm7ldhk7qrm4a');

    private options: RequestOptionsArgs = {
        headers: new Headers({
            'cache-control': 'no-cache',
            'authorization': `Basic ${this.accessCode}`,
            'Content-Type': 'application/json'
        })
    };

    constructor(
        private http: Http
    ) { }

    getBuilds() {
        return this.http.get(`${this.baseLocationOpus}/build/builds`, this.options)
            .map((res: Response) => {
                const response = res.json();
                return response.value;
            })
            .catch(this.handleError);
    }

    getBuildTimeline(build: Build) {
        return this.http.get(`${this.baseLocationOpus}/build/builds/${build.id}/timeline`, this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getBuildDefinitions() {
        return this.http.get(`${this.baseLocationOpus}/build/definitions`, this.options)
            .map((res: Response) => {
                const response = res.json();
                return response.value;
            })
            .catch(this.handleError);
    }

    getReleases() {
        return this.http.get(`${this.baseLocationOpus}/release/releases`, this.options)
            .map((res: Response) => {
                const response = res.json();
                return response.value;
            })
            .catch(this.handleError);
    }

    getReleaseDetails(release: Release) {
        return this.http.get(`${this.baseLocationOpus}/release/releases/${release.id}`, this.options)
            .map((res: Response) => {
                const response = res.json();
                const artifact = <Artifact>{};
                if (response.environments && response.environments[0]
                    && response.environments[0].artifacts && response.environments[0].artifacts[0]) {
                    if (response.environments[0].artifacts[0].version) {
                        artifact.versionId = response.environments[0].artifacts[0].version.id;
                        artifact.versionName = response.environments[0].artifacts[0].version.name;
                    }

                    if (response.environments[0].artifacts[0].branch) {
                        artifact.branchId = response.environments[0].artifacts[0].branch.id;
                        artifact.branchName = response.environments[0].artifacts[0].branch.name;
                    }
                }
                return <Release>{
                    ...response,
                    artifact
                };

            })
            .catch(this.handleError);
    }

    getReleaseDefinitions() {
        return this.http.get(`${this.baseLocationOpus}/release/definitions`, this.options)
            .map((res: Response) => {
                const response = res.json();
                return response.value;
            })
            .catch(this.handleError);
    }

    createRelease(build: Build, definition: ReleaseDefinition) {
        return this.http
        .post(
            `${this.baseLocationOpus}/release/releases?api-version=2.2-preview.1`,
            JSON.stringify(this.createReleaseRequest(build, definition)),
            this.options)
        .map((res: Response) => {
            const response = res.json();
            return response.value;
        })
        .catch(this.handleError);
    }

    private createAuthorization(token: string) {
        const buff = new Buffer(`:${token}`);
        return buff.toString('base64');
    }

    private handleError(error: Response | any, caught: Observable<any>) {
        console.error(error.json());
        return Observable.throw(error);
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
}
