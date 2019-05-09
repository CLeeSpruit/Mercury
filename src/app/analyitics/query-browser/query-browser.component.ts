import { Component, OnInit, Input } from '@angular/core';
import { CustomQueryService } from 'analyitics/services/custom-query.service';
import { TfsQueryOrFolder } from 'analyitics/models/tfs-query';
import { AnalyticsCommService } from 'analyitics/services/analytics-comm.service';

@Component({
    selector: 'hg-query-browser',
    templateUrl: 'query-browser.component.html',
    styleUrls: ['query-browser.component.scss']
})
export class QueryBrowserComponent implements OnInit {
    @Input() root: TfsQueryOrFolder;
    private queries: Array<TfsQueryOrFolder> = new Array<TfsQueryOrFolder>();

    constructor(
        private customQueryService: CustomQueryService,
        private commService: AnalyticsCommService
    ) {
        //
    }

    ngOnInit() {
        if (!this.root) {
            this.customQueryService.getQueries().subscribe(queries => this.queries = queries);
        } else {
            this.queries = this.root.children;
        }
    }

    private populateChildren(folder: TfsQueryOrFolder, index: number) {
        this.customQueryService.getQueries(folder.id).subscribe(queries => {
            this.queries[index].children = queries;
        });
    }

    toggleFolderCollapse(folder: TfsQueryOrFolder) {
        const index = this.queries.findIndex(f => f.id === folder.id);
        // TODO: Throw error
        if (index !== -1) { return; }

        if (folder.isExpanded) {
            this.queries[index].isExpanded = false;
        } else {
            if (folder.hasChildren && !folder.children) {
                this.populateChildren(folder, index);
            }
            this.queries[index].isExpanded = true;
        }
    }

    openQuery(query: TfsQueryOrFolder) {
        this.customQueryService.runCustomQuery(query.id).subscribe(data => {
            this.commService.setQueryResults(data);
            this.commService.setQueryEdit(query);
        });
    }

    createFolder(folderName: string) {
        // TODO:
    }
}
