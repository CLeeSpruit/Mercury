import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Build } from '../models/build.model';

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
            'Content-Type': 'application/json-patch+json'
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

    getReleaseDefinitions() {
        return this.http.get(`${this.baseLocationOpus}/release/definitions`, this.options)
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
}
