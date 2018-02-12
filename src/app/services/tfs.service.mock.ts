import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WorkItem } from './../models/work-item';
import { Sprint } from './../models/sprint';

@Injectable()
export class TfsServiceMock {
    getProjects() {
        return Observable.of({});
    }

    getRecentCommits() {
        return Observable.of({});
    }

    getCurrentSprint() {
        return Observable.of({});
    }

    getWorkAssignedQuery() {
        return Observable.of({});
    }

    runQuery(queryId: string) {
        return Observable.of({});
    }

    getSpecificWorkItems(itemIds: Array<string>) {
        return Observable.of({});
    }

    editWorkItem(itemId: number, changes: WorkItem) {
        return Observable.of({});
    }
}

