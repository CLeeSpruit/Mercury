import { Injectable } from '@angular/core';
import { QueryService } from '@shared/services/query.service';
import { Query } from '@shared/models/query';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AsyncSubject } from 'rxjs';
import { ConfigService } from 'config/services/config.service';

@Injectable()
export class BacklogService extends QueryService {
    backlogQueryName = '_backlog';

    constructor(
        protected http: HttpClient,
        protected configService: ConfigService
    ) { super(http, configService); }

    getBacklog() {
        const workItemsSub: AsyncSubject<Array<string>> = new AsyncSubject<Array<string>>();

        this.fetchBacklogQuery().subscribe((id: string) => {
            this.runQuery(id).subscribe((data: Array<string>) => {
                workItemsSub.next(data);
                workItemsSub.complete();
            });
        });

        return workItemsSub;
    }

    private createBacklogQuery(): AsyncSubject<string> {
        const query: Query = <Query>{
            'api-version': '1.0',
            name: this.backlogQueryName,
            isFolder: false,
            wiql: `
            SELECT
                [System.Id],[System.Title],[System.State],[System.Tags],
                [System.WorkItemType],[System.IterationId],[Microsoft.VSTS.Common.BacklogPriority]
            FROM WorkItems
            WHERE
                [System.TeamProject] = @project AND
                [System.WorkItemType] <> 'Task' AND
                [System.State] <> 'Removed' AND
                [System.State] <> 'Done'
            ORDER BY [Microsoft.VSTS.Common.BacklogPriority] ASC
            `
        };

        return this.createQuery(query);
    }

    // TODO: Clean up and move generic to query.service
    private fetchBacklogQuery(): AsyncSubject<string> {
        const asyncId: AsyncSubject<string> = new AsyncSubject<string>();
        // TODO: Check localstorage

        // If localstorage fails, fetch from server. If the server fetch fails, create folder
        this.getQuery(this.backlogQueryName).subscribe(id => {
            asyncId.next(id);
            asyncId.complete();
        }, (error: any) => {
            const missingQueryErrorCode = 600288;
            const tfsError = error.error;
            if (tfsError && tfsError.errorCode === missingQueryErrorCode) {
                this.createBacklogQuery().subscribe((id => {
                    asyncId.next(id);
                    asyncId.complete();
                }), (createIterationError: any) => {
                    // If error, fetch folder, then create
                    const tfsIterationError = createIterationError.error;
                    if (tfsIterationError && tfsIterationError.errorCode === missingQueryErrorCode) {
                        this.fetchMercuryFolder().subscribe(() => {
                            this.createBacklogQuery().subscribe((id => {
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
}
