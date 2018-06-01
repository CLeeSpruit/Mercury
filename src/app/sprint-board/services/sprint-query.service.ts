import { Injectable } from '@angular/core';
import { QueryService } from '@shared/services/query.service';
import { Sprint } from '@sprint/models/sprint';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Query } from '@shared/models/query';
import { HttpClient } from '@angular/common/http';
import { WorkItem } from '@sprint/models/work-item';

@Injectable()
export class SprintQueryService extends QueryService {
    constructor(protected http: HttpClient) { super(http); }

    // TODO: clean this up and move to query service
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

    getIterationWorkItems(sprint: Sprint): AsyncSubject<Array<number>> {
        const workItemsSub: AsyncSubject<Array<number>> = new AsyncSubject<Array<number>>();
        // Check if query already exists
        const name = sprint.name;
        this.fetchQuery(sprint).subscribe((id: string) => {
            this.runQuery(id).subscribe((data: Array<number>) => {
                workItemsSub.next(data);
                workItemsSub.complete();
            });
        });

        return workItemsSub;
    }
}
