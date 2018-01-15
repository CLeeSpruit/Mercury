import { WorkItem } from './../models/work-item';
import { Sprint } from './../models/sprint';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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

    getCurrentSprint() {
        return this.http.get(`${this.baseLocationOpus}work/TeamSettings/Iterations?$timeframe=current`, this.options)
            .map(res => {
                const payload = res.json();
                return <Sprint>(payload.value[0]) || payload;
            });
    }

    getWorkAssignedQuery() {
        return this.http.get(`${this.baseLocationOpus}wit/queries/Shared%20Queries/Work%20Assigned`, this.options)
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
                return <WorkItem>{
                    id: wi.id,
                    rev: wi.rev,
                    url: wi.url,
                    areaPath: wi.fields['System.AreaPath'],
                    teamProject: wi.fields['System.TeamProject'],
                    iterationPath: wi.fields['System.IterationPath'],
                    workItemType: wi.fields['System.WorkItemType'],
                    state: wi.fields['System.State'],
                    reason: wi.fields['System.Reason'],
                    assignedTo: wi.fields['System.AssignedTo'],
                    createdDate: new Date(wi.fields['System.CreatedDate']),
                    createdBy: wi.fields['System.CreatedBy'],
                    changedDate: new Date(wi.fields['System.ChangedDate']),
                    changedBy: wi.fields['System.ChangedBy'],
                    title: wi.fields['System.Title'],
                    remainingWork: wi.fields['Microsoft.VSTS.Scheduling.RemainingWork'],
                    backlogPriority: wi.fields['Microsoft.VSTS.Common.BacklogPriority'],
                    description: wi.fields['System.Description'],
                    childrenIds: wi.relations
                        .map((relation: any) => {
                            if (relation.rel === 'System.LinkTypes.Hierarchy-Forward') {
                                return this.stripUrl(relation.url);
                            }
                        }).filter((relation: any) => {
                            if (relation) { return relation; }
                        })
                };
            });
        }

        return payload;
    }

    private stripUrl(url: string) {
        // Return only the last series of numbers, which is the id
        return url.match(/\d*$/)[0];
    }
}

