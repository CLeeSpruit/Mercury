import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TfsService {
    private baseLocationGeneric = 'http://tfs2013-mn:8080/tfs/DefaultCollection/_apis/';
    private baseLocationOpus = 'http://tfs2013-mn:8080/tfs/DefaultCollection/OPUS/_apis/'
    private accessCode = this.createAuthorization('lpinsks2xb6nhvw6fxn2474koaq3l5647bg7lkikm7ldhk7qrm4a');

    private options: RequestOptionsArgs = {
        headers: new Headers({
            'cache-control': 'no-cache',
            'authorization': `Basic ${this.accessCode}`
        })
    };

    constructor(
        private http: Http
    ) { }

    getProjects() {
        return this.http.get(`${this.baseLocationGeneric}projects`, this.options)
            .map(res => {
                return res.json();
            });
    }

    getRecentCommits() {
        return this.http.get(`${this.baseLocationOpus}git/repositories/OPUS/commits`, this.options)
            .map(res => {
                return res.json();
            });
    }

    private handleError(error: Response | any, caught: Observable<any>) {
        console.error(error.json());
        return Observable.throw(error);
    }

    private createAuthorization(token: string) {
        const buff = new Buffer(`:${token}`);
        return buff.toString('base64');
    }
}
