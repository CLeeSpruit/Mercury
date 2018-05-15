import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    private options = {
        headers: new HttpHeaders({
            'cache-control': 'no-cache',
            'Content-Type': 'application/json-patch+json'
        })
    };

    constructor(
        private http: HttpClient,
        private workItemMapper: WorkItemMapper
    ) { }

    getProjects(): Observable<any> {
        return this.http.get(`${this.baseLocationGeneric}projects`, this.options);
    }

    // Not used currently
    getRecentCommits() {
        return this.http.get(`${this.baseLocationOpus}git/repositories/OPUS/commits`, this.options);
    }

    getCurrentSprint(): Observable<Sprint> {
        return this.http.get(`${this.baseLocationOpus}work/TeamSettings/Iterations?$timeframe=current`, this.options)
            .map((data: any) => {
                return <Sprint>(data.value[0]) || data;
            });
    }

    // TODO: Create a query object
    getWorkAssignedQuery(): Observable<any> {
        // TODO: Get this query into shared queries for other users
        const sharedLocation = '/Shared%20Queries/Work%20Assigned';
        const myLocation = '/My%20Queries/Kanban';
        const testLocation = '/My%20Queries/Sprint%2036';
        return this.http.get(`${this.baseLocationOpus}wit/queries${testLocation}`, this.options)
            .map((data: any) => {
                return data.id || data;
            });
    }

    runQuery(queryId: string): Observable<Array<string>> {
        return this.http.get(`${this.baseLocationOpus}wit/wiql/${queryId}`, this.options)
            .map((data: any) => {
                if (data.workItems) {
                    return data.workItems.map(wi => {
                        return wi.id;
                    });
                }
                return data;
            });
    }

    getSpecificWorkItems(itemIds: Array<string>): Observable<Array<WorkItem>> {
        const ids = itemIds.toString();
        return this.http.get(`${this.baseLocationGeneric}wit/workitems?ids=${ids}&$expand=all`, this.options)
            .map(this.mapWorkItems.bind(this));
    }

    editWorkItem(itemId: number, changes: WorkItem): Observable<any> {
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

    // TODO: Create a responses interceptor for these
    private handleError(error: Response | any, caught: Observable<any>) {
        console.error(error.json());
        return Observable.throw(error);
    }

    private mapWorkItems(payload) {
        if (payload && payload.value) {
            return payload.value.map((wi: any) => {
                return this.workItemMapper.mapWorkItem(wi);
            });
        }

        return payload;
    }
}

