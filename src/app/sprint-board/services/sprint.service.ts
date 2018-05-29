import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { WorkItem } from '../models/work-item';

@Injectable()
export class SprintService {
    private workItemChangedSub: Subject<WorkItem> = new Subject<WorkItem>();

    listenToWorkItemChange() {
        return this.workItemChangedSub.asObservable();
    }

    sendChangedWorkItem(workItem: WorkItem) {
        this.workItemChangedSub.next(workItem);
    }
}
