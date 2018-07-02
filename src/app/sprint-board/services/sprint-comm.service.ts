import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WorkItem } from '@sprint/models/work-item';
import { Observable } from 'rxjs/Observable';
import { TaskStatus } from '@sprint/constants/task-status';
import { WorkItemTypes } from '@sprint/constants/work-item-types';

@Injectable()
export class SprintCommService {
    // Used for individual components, a queryable mirror of the subject below
    private pbis: Map<number, BehaviorSubject<WorkItem>> = new Map<number, BehaviorSubject<WorkItem>>();
    // Used for the sprint component
    private allPbis: BehaviorSubject<Array<WorkItem>> = new BehaviorSubject<Array<WorkItem>>([]);
    // Used for column components
    private columns: Map<string, BehaviorSubject<Array<WorkItem>>> = new Map<string, BehaviorSubject<Array<WorkItem>>>([
        [TaskStatus.todo, new BehaviorSubject([])],
        [TaskStatus.inProgress, new BehaviorSubject([])],
        [TaskStatus.done, new BehaviorSubject([])]
    ]);

    getPbi(id: number): Observable<WorkItem> {
        return this.pbis.get(id).asObservable();
    }

    setPbi(pbi: WorkItem) {
        const previousColumn: string = pbi.column;
        const nextColumnPbi: WorkItem = this.findColumn(pbi);

        if (previousColumn !== nextColumnPbi.column) {
            this.moveColumn(pbi, previousColumn, nextColumnPbi.column);
        }
        const subject = this.pbis.get(pbi.id);
        subject.next(pbi);
    }

    getAllPbis(): Observable<Array<WorkItem>> {
        return this.allPbis.asObservable();
    }

    setAllPbis(pbisArr: Array<WorkItem>) {
        this.pbis.forEach(pbi => pbi.unsubscribe());
        this.pbis.clear();

        this.sortWork(pbisArr);
        pbisArr.forEach(pbi => {
            this.pbis.set(pbi.id, new BehaviorSubject(pbi));
        });
        this.allPbis.next(pbisArr);
    }

    getColumn(columnName: string): Observable<Array<WorkItem>> {
        return this.columns.get(columnName).asObservable();
    }

    /*** Private ***/

    private sortWork(workItems: Array<WorkItem>): Array<WorkItem> {
        const items: Array<WorkItem> = workItems
            .filter(wi => (wi.workItemType === WorkItemTypes.pbi || wi.workItemType === WorkItemTypes.bug))
            .map((wi: WorkItem, index: number, arr: Array<WorkItem>) => {
                wi = this.linkTasks(wi, arr);
                wi = this.findColumn(wi);
                return wi;
            });

        this.columns.get(TaskStatus.todo).next(items.filter(wi => wi.column === TaskStatus.todo));
        this.columns.get(TaskStatus.inProgress).next(items.filter(wi => wi.column === TaskStatus.inProgress));
        this.columns.get(TaskStatus.done).next(items.filter(wi => wi.column === TaskStatus.todo));

        return items;
    }

    private linkTasks(pbi: WorkItem, pbiList: Array<WorkItem>): WorkItem {
        // For now, only go one deep. If a tree is needed...well, we'll get to that bridge when we come to it
        if (pbi.childrenIds && pbi.childrenIds.length) {
            pbi.children = pbi.childrenIds.map((taskId: number) => {
                if (!taskId) { return; }

                const id = taskId;
                return pbiList.find((task: WorkItem) => {
                    return task.id === +id;
                });
            }).filter((task: WorkItem) => {
                if (task) { return task; }
            });
        }

        return pbi;
    }

    private findColumn(workItem: WorkItem): WorkItem {
        // To do: No tasks have been assigned
        // In progress: One or more tasks have been moved to 'In Progress'
        // Testing: At least one task have been moved to 'Ready to Test', overwrites in progress. not being used
        // Done: All tasks have been moved to done
        if (!workItem.children || !workItem.children.length) {
            // TODO: Check the state of the pbi, not assume it's in todo
            workItem.column = TaskStatus.todo;
        } else if (workItem.children.every(child => child.state === TaskStatus.done)) {
            workItem.column = TaskStatus.done;
        } else if (workItem.children.find(child => child.state === TaskStatus.testing)) {
            workItem.column = TaskStatus.testing;
        } else if (workItem.children.find(child => child.state === TaskStatus.inProgress)) {
            workItem.column = TaskStatus.inProgress;
        } else {
            workItem.column = TaskStatus.todo;
        }

        return workItem;
    }

    private moveColumn(workItem: WorkItem, previousColumn: string, nextColumn: string) {
        const futureList = this.columns.get(nextColumn).getValue();
        const previousList = this.columns.get(previousColumn).getValue();
        if (previousList) {
            const foundIndex = previousList.findIndex(wi => wi.id === workItem.id);
            if (foundIndex !== -1) {
                previousList.splice(foundIndex, 1);
                this.columns.get(previousColumn).next(previousList);
            }
        }

        // TODO: Sort this by priority
        futureList.push(workItem);
        this.columns.get(nextColumn).next(futureList);
    }
}
