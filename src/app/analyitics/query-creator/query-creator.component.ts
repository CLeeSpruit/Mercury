import { Component, OnInit } from '@angular/core';
import { CustomQueryService } from 'analyitics/services/custom-query.service';
import { AnalyticsCommService } from 'analyitics/services/analytics-comm.service';
import { TfsQueryOrFolder } from 'analyitics/models/tfs-query';

@Component({
    selector: 'hg-query-creator',
    templateUrl: 'query-creator.component.html',
    styleUrls: ['query-creator.component.scss']
})
export class QueryCreatorComponent implements OnInit {
    query: TfsQueryOrFolder;

    constructor(
        private customQueryService: CustomQueryService,
        private commService: AnalyticsCommService
    ) {
        customQueryService.init();
        // Placeholder Query
        this.query = <TfsQueryOrFolder>{
            name: 'New Query',
            wiql: `SELECT
    [System.Id],[System.Title],[System.State],[System.Tags],
    [System.WorkItemType],[System.IterationId],[Microsoft.VSTS.Common.BacklogPriority]
FROM WorkItems
WHERE
    [System.TeamProject] = @project AND
    [System.WorkItemType] <> 'Task' AND
    [System.State] <> 'Removed' AND
    [System.State] <> 'Done'
ORDER BY [Microsoft.VSTS.Common.BacklogPriority] ASC`
        };
    }

    ngOnInit() {
        this.commService.getQueryEdit().subscribe(query => {
            this.query = query;
        });
    }

    // TODO: Update Query

    createQuery(queryName: string, queryBody: string) {
        const sanitizedQueryName = queryName.trim().normalize();
        // TODO: Throw error if name or body is whitespace
        if (sanitizedQueryName === '' || queryBody === '') { return; }

        // TODO: Throw error if query is not actually a legit query
        if (!queryBody.toLowerCase().includes('select') || !queryBody.toLowerCase().includes('where')) {
            return;
        }

        this.customQueryService.createCustomQuery(queryName, queryBody).subscribe((queryId: string) => {
            if (!queryId) {
                // TODO: Throw error that query was not successful
                return;
            } else {
                this.customQueryService.runCustomQuery(queryId).subscribe(results => {
                    this.commService.setQueryResults(results);
                });
            }
        });
    }
}
