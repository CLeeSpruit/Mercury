import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Query } from '../models/query';
import { Sprint } from '@sprint/models/sprint';
import { WorkItem } from '@sprint/models/work-item';

export class QueryService {
    protected baseLocationGeneric = 'http://tfs2013-mn:8080/tfs/DefaultCollection/_apis/';
    protected baseLocationOpus = 'http://tfs2013-mn:8080/tfs/DefaultCollection/OPUS/_apis/';
    protected myQueries = '/My%20Queries';
    protected folder = '/Mercury';

    protected options = {
        headers: new HttpHeaders({
            'cache-control': 'no-cache',
            'Content-Type': 'application/json'
        })
    };

    constructor(
        protected http: HttpClient
    ) { }

    /*** Create Folder Query ***/

    // TODO: Move this to protected when fetch is recreated
    // Returns the id of the folder is successful
    protected createMercuryFolder(): Observable<string> {
        const query: Query = <Query>{
            'api-version': '1.0',
            name: 'Mercury',
            isFolder: true
        };
        return this.http.post(`${this.baseLocationOpus}wit/queries/${this.myQueries}?api-version=1.0`, query, this.options)
            .map((data: any) => data.id);
    }

    // Returns the id of the folder
    private getMercuryFolder(): Observable<string> {
        // TODO: Consider storing the folder id in localstorage
        const mercuryLocation = this.myQueries + this.folder;
        return this.http.get(`${this.baseLocationOpus}wit/queries${mercuryLocation}`, this.options).map((data: any) => data.id);
    }

    // TODO: Move this to protected when fetch is recreated
    protected fetchMercuryFolder(): AsyncSubject<string> {
        const asyncId: AsyncSubject<string> = new AsyncSubject<string>();
        // TODO: Check localstorage

        // If localstorage fails, fetch from server. If the server fetch fails, create folder
        this.getMercuryFolder().subscribe(id => {
            asyncId.next(id);
            asyncId.complete();
        }, (error: any) => {
            const tfsError = error.error;
            const missingFolderErrorCode = 600288;
            if (tfsError && tfsError.errorCode === missingFolderErrorCode) {
                this.createMercuryFolder().subscribe((id => {
                    asyncId.next(id);
                    asyncId.complete();
                }));
            }
            // TODO: Handle if the code is not the missing folder code
        });

        return asyncId;
    }

    /*** Create Queries ***/
    protected getQuery(name: string) {
        const mercuryLocation = this.myQueries + this.folder;
        return this.http.get(
            `${this.baseLocationOpus}wit/queries${mercuryLocation}/${name}`, this.options)
            .map((data: any) => data.id);
    }


    protected createQuery(query: Query): AsyncSubject<string> {
        const isSuccessful: AsyncSubject<string> = new AsyncSubject<string>();
        this.fetchMercuryFolder().subscribe(id => {
            query['api-version'] = '1.0';
            query.isFolder = false;

            // Create New Mercury query
            this.http.post(`${this.baseLocationOpus}wit/queries/${id}?api-version=1.0`, query, this.options).subscribe(
                (data: any) => {
                    isSuccessful.next(data.id);
                    isSuccessful.complete();
                }, () => {
                    isSuccessful.next(null);
                    isSuccessful.complete();
                });
        });

        return isSuccessful;
    }

    protected runQuery(queryId: any): Observable<Array<any>> {
        return this.http.get(`${this.baseLocationOpus}wit/wiql/${queryId}`, this.options)
            .map((data: any) => {
                if (data.workItems) {
                    return data.workItems.map(wi => {
                        // TODO: Can we grab this from the query now?
                        return wi.id;
                    });
                }
                return data;
            });
    }
}