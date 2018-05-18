import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WorkItem } from '../models/work-item';

@Injectable()
export class SprintServiceMock {
    listenToWorkItemChange() {
        return Observable.of({});
    }

    sendChangedWorkItem(workItem: WorkItem) {
        return;
    }
}
