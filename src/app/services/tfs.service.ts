import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { WorkItem } from './../models/work-item';
import { Sprint } from './../models/sprint';
import { WorkItemMapper } from './../shared/work-item-mapper';
import { WorkItemTypes } from './../shared/work-item-types';

@Injectable()
export class TfsService {
    private baseLocationGeneric = 'http://tfs2013-mn:8080/tfs/DefaultCollection/_apis/';
    private baseLocationOpus = 'http://tfs2013-mn:8080/tfs/DefaultCollection/OPUS/_apis/';
    private accessCode = this.createAuthorization('lpinsks2xb6nhvw6fxn2474koaq3l5647bg7lkikm7ldhk7qrm4a');

    private options: RequestOptionsArgs = {
        headers: new Headers({
            'cache-control': 'no-cache',
            'authorization': `Basic ${this.accessCode}`,
            'Content-Type': 'application/json-patch+json'
        })
    };

    constructor(
        private http: Http,
        private workItemMapper: WorkItemMapper
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

    getCurrentSprint() {
        return this.http.get(`${this.baseLocationOpus}work/TeamSettings/Iterations?$timeframe=current`, this.options)
            .map(res => {
                const payload = res.json();
                return <Sprint>(payload.value[0]) || payload;
            });
    }

    getWorkAssignedQuery() {
        // TODO: Get this query into shared queries for other users
        const sharedLocation = '/Shared%20Queries/Work%20Assigned';
        const myLocation = '/My%20Queries/Kanban';
        const testLocation = '/My%20Queries/Sprint%2036';
        return this.http.get(`${this.baseLocationOpus}wit/queries${testLocation}`, this.options)
            .map(res => {
                const payload = res.json();
                return payload.id || payload;
            });
    }

    runQuery(queryId: string) {
        return this.http.get(`${this.baseLocationOpus}wit/wiql/${queryId}`, this.options)
            .map(res => {
                const payload = res.json();
                if (payload.workItems) {
                    return payload.workItems.map(wi => {
                        return wi.id;
                    });
                }
                return payload;
            });
    }

    getSpecificWorkItems(itemIds: Array<string>) {
        const ids = itemIds.toString();
        return this.http.get(`${this.baseLocationGeneric}wit/workitems?ids=${ids}&$expand=all`, this.options)
            .map(this.mapWorkItems.bind(this));
    }

    editWorkItem(itemId: number, changes: WorkItem) {
        // Map changes to items that the server can parse
        const allChanges = [];

        if (changes.remainingWork) {
            allChanges.push({
                op: 'replace',
                path: '/fields/Microsoft.VSTS.Scheduling.RemainingWork',
                value: changes.remainingWork
            });
        }

        if (changes.state) {
            allChanges.push({
                op: 'replace',
                path: '/fields/System.State',
                value: changes.state
            });
        }

        if (changes.title) {
            allChanges.push({
                op: 'replace',
                path: '/fields/System.Title',
                value: changes.title
            });
        }

        return this.http.patch(
            `${this.baseLocationGeneric}wit/workitems/${itemId}?api-version=1.0`,
            JSON.stringify(allChanges),
            this.options);
    }

    createTask(newItem: WorkItem, parent: WorkItem) {
        const type = WorkItemTypes.task;
        const itemToBeAdded = this.workItemMapper.createNewTfsTask(newItem, parent);

        return this.http.patch(
            `${this.baseLocationOpus}wit/workitems/$${type}?api-version=1.0`,
            JSON.stringify(itemToBeAdded),
            this.options).map(
                this.mapWorkItems.bind(this)
            );
    }

    createPbi(newPbi: WorkItem) {
        const type = WorkItemTypes.pbi;
        const itemToBeAdded = this.workItemMapper.createNewTfsPBI(newPbi);

        return this.http.patch(
            `${this.baseLocationOpus}wit/workitems/$${type}?api-version=1.0`,
            JSON.stringify(itemToBeAdded),
            this.options).map(
                this.mapWorkItems.bind(this)
            );
    }

    private handleError(error: Response | any, caught: Observable<any>) {
        console.error(error.json());
        return Observable.throw(error);
    }

    private createAuthorization(token: string) {
        const buff = new Buffer(`:${token}`);
        return buff.toString('base64');
    }

    private mapWorkItems(res) {
        const payload: any = res.json();

        if (payload && payload.value) {
            return payload.value.map((wi: any) => {
                return this.workItemMapper.mapWorkItem(wi);
            });
        }

        return payload;
    }
}

