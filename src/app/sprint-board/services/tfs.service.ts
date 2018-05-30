import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { WorkItem } from '@sprint/models/work-item';
import { Sprint } from '@sprint/models/sprint';
import { WorkItemMapper } from '@sprint/constants/work-item-mapper';
import { WorkItemTypes } from '@sprint/constants/work-item-types';
import { QueryService } from '@sprint/services/query.service';

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
        private workItemMapper: WorkItemMapper,
        private queryService: QueryService
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

    getSprint(sprintId: string): Observable<Sprint> {
        return this.http.get(`${this.baseLocationOpus}work/TeamSettings/Iterations/${sprintId}`, this.options)
        .map(data => data as Sprint);
    }

    getAllSprints(): Observable<Array<Sprint>> {
        return this.http.get(`${this.baseLocationOpus}work/TeamSettings/Iterations`, this.options)
            .map((data: any) => {
                return <Array<Sprint>>(data.value);
            });
    }

    getSprintWorkItems(sprint: Sprint): AsyncSubject<Array<string>> {
        return this.queryService.getIterationWorkItems(sprint);
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

        if (changes.description) {
            allChanges.push({
                op: 'replace',
                path: '/fields/System.Description',
                value: changes.description
            });
        }

        if (changes.acceptanceCriteria) {
            allChanges.push({
                op: 'replace',
                path: '/fields/Microsoft.VSTS.Common.AcceptanceCriteria',
                value: changes.acceptanceCriteria
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

