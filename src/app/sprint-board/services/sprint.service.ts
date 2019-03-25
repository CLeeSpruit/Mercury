import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { WorkItem } from '../models/work-item';

@Injectable()
export class SprintService {
    private workItemChangedSub: Subject<WorkItem> = new Subject<WorkItem>();
    private selectedPbi: Subject<WorkItem> = new Subject<WorkItem>();

    // TODO: no one is listening
    listenToWorkItemChange() {
        return this.workItemChangedSub.asObservable();
    }

    sendChangedWorkItem(workItem: WorkItem) {
        this.workItemChangedSub.next(workItem);
    }

    getSelectedPbi() {
        return this.selectedPbi.asObservable();
    }

    setSelectedPbi(pbi: WorkItem) {
        // TODO: Validate this is a PBI
        this.selectedPbi.next(pbi);
    }
}
