import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Query } from '@sprint/models/query';
import { Sprint } from '@sprint/models/sprint';

@Injectable()
export class QueryService {
    private baseLocationGeneric = 'http://tfs2013-mn:8080/tfs/DefaultCollection/_apis/';
    private baseLocationOpus = 'http://tfs2013-mn:8080/tfs/DefaultCollection/OPUS/_apis/';
    private myQueries = '/My%20Queries';
    private folder = '/Mercury';

    private options = {
        headers: new HttpHeaders({
            'cache-control': 'no-cache',
            'Content-Type': 'application/json'
        })
    };

    constructor(
        private http: HttpClient
    ) { }

    /*** Create Folder Query ***/

    // Returns the id of the folder is successful
    private createMercuryFolder(): Observable<string> {
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

    private fetchMercuryFolder(): AsyncSubject<string> {
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

    // TODO: Insert types if non iteration queries are created
    private fetchQuery(sprint: Sprint): AsyncSubject<string> {
        const asyncId: AsyncSubject<string> = new AsyncSubject<string>();
        // TODO: Check localstorage

        // If localstorage fails, fetch from server. If the server fetch fails, create folder
        this.getQuery(sprint.name).subscribe(id => {
            asyncId.next(id);
            asyncId.complete();
        }, (error: any) => {
            const missingQueryErrorCode = 600288;
            const tfsError = error.error;
            if (tfsError && tfsError.errorCode === missingQueryErrorCode) {
                this.createIterationQuery(sprint).subscribe((id => {
                    asyncId.next(id);
                    asyncId.complete();
                }), (createIterationError: any) => {
                    // If error, fetch folder, then create
                    const tfsIterationError = createIterationError.error;
                    if (tfsIterationError && tfsIterationError.errorCode === missingQueryErrorCode) {
                        this.fetchMercuryFolder().subscribe(() => {
                            this.createIterationQuery(sprint).subscribe((id => {
                                asyncId.next(id);
                                asyncId.complete();
                            }));
                        });
                    }
                });
            }
        });

        return asyncId;
    }

    private getQuery(name: string) {
        const mercuryLocation = this.myQueries + this.folder;
        return this.http.get(
            `${this.baseLocationOpus}wit/queries${mercuryLocation}/${name}`, this.options)
            .map((data: any) => data.id);
    }


    private createQuery(query: Query): AsyncSubject<string> {
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

    private createIterationQuery(sprint: Sprint): AsyncSubject<string> {
        const query: Query = <Query>{
            name: sprint.name,
            wiql: `
                SELECT [System.Id],[System.WorkItemType],[System.Title],[System.AssignedTo],[System.State],[System.Tags]
                FROM WorkItems
                WHERE
                    [System.TeamProject] = @project AND
                    [System.IterationPath] = '${sprint.path}' AND
                    [System.State] <> 'Removed'
                `
        };

        return this.createQuery(query);
    }

    private runQuery(queryId: string): Observable<Array<string>> {
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



    getIterationWorkItems(sprint: Sprint): AsyncSubject<Array<string>> {
        const workItemsSub: AsyncSubject<Array<string>> = new AsyncSubject<Array<string>>();
        // Check if query already exists
        const name = sprint.name;
        this.fetchQuery(sprint).subscribe((id: string) => {
            this.runQuery(id).subscribe((data: Array<string>) => {
                workItemsSub.next(data);
                workItemsSub.complete();
            });
        });

        return workItemsSub;
    }
}
