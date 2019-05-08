import { Component } from '@angular/core';
import { CustomQueryService } from 'analyitics/services/custom-query.service';
import { AnalyticsCommService } from 'analyitics/services/analytics-comm.service';

@Component({
    selector: 'hg-query-creator',
    templateUrl: 'query-creator.component.html',
    styleUrls: ['query-creator.component.scss']
})
export class QueryCreatorComponent {
    constructor(
        private customQueryService: CustomQueryService,
        private commService: AnalyticsCommService
    ) {
        customQueryService.init();
    }

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
