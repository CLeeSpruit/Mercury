import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable, of } from 'rxjs';
import { WorkItem } from '@sprint/models/work-item';
import { TaskStatus } from '@sprint/constants/task-status';
import { WorkItemTypes } from '@sprint/constants/work-item-types';
import { TfsService } from '@sprint/services/tfs.service';


@Injectable()
export class SprintCommService {
    // Used for individual components, a queryable mirror of the subject below
    private pbis: Map<string | number, BehaviorSubject<WorkItem>> = new Map<string | number, BehaviorSubject<WorkItem>>();
    // Used for the sprint component
    private allPbis: BehaviorSubject<Array<WorkItem>> = new BehaviorSubject<Array<WorkItem>>([]);
    // Used for column components
    private columns: Map<string, BehaviorSubject<Array<WorkItem>>> = new Map<string, BehaviorSubject<Array<WorkItem>>>([
        [TaskStatus.todo, new BehaviorSubject([])],
        [TaskStatus.inProgress, new BehaviorSubject([])],
        [TaskStatus.done, new BehaviorSubject([])]
    ]);

    constructor(private tfsService: TfsService) { }

    /*** Task ***/
    createTask(taskTitle: string, parentId: string) {
        const parent = this.pbis.get(parentId).getValue();
        this.tfsService.createTask(taskTitle, parent).subscribe((data: WorkItem) => {
            this.setTask(data);
            // Add to parent without having to refetch
            parent.childrenIds.push(data.id);
            this.setPbi(parent);
        });
    }

    setTask(task: WorkItem, parentId?: string) {
        const subject = this.pbis.get(task.id);
        if (parentId) {
            // Tell the parent to reinit
            const parent = this.pbis.get(parentId).getValue();
            const childTaskIndex = parent.children.findIndex(child => child.id === task.id);
            if (childTaskIndex !== -1) {
                const newChildren = new Array(...parent.children);
                newChildren[childTaskIndex] = task;
                parent.children = newChildren;
                this.setPbi(parent);
            }
        }
        subject.next(task);
    }

    /*** PBI ***/
    getWorkItem(id: string | number): Observable<WorkItem> {
        if (!this.pbis.get(+id)) {
            return of(null);
        }
        return this.pbis.get(+id).asObservable();
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

    /*** Sprint level ***/
    getAllPbis(): Observable<Array<WorkItem>> {
        return this.allPbis.asObservable();
    }

    setAllPbis(pbisArr: Array<WorkItem>) {
        this.pbis.forEach(pbi => pbi.unsubscribe());
        this.pbis.clear();

        const sorted = this.sortPbis(pbisArr);
        pbisArr.forEach(pbi => {
            this.pbis.set(+pbi.id, new BehaviorSubject(pbi));
        });
        this.allPbis.next(pbisArr);
        this.columns.get(TaskStatus.todo).next(sorted.filter(wi => wi.column === TaskStatus.todo));
        this.columns.get(TaskStatus.inProgress).next(sorted.filter(wi => wi.column === TaskStatus.inProgress));
        this.columns.get(TaskStatus.done).next(sorted.filter(wi => wi.column === TaskStatus.done));

    }

    getColumn(columnName: string): Observable<Array<WorkItem>> {
        return this.columns.get(columnName).asObservable();
    }

    /*** Private ***/

    private sortPbis(workItems: Array<WorkItem>): Array<WorkItem> {
        const items: Array<WorkItem> = workItems
            .filter(wi => (wi.workItemType === WorkItemTypes.pbi || wi.workItemType === WorkItemTypes.bug))
            .map((wi: WorkItem) => {
                wi = this.linkTasks(wi, workItems);
                wi = this.findColumn(wi);
                return wi;
            });
        return items;
    }

    private linkTasks(pbi: WorkItem, pbiList: Array<WorkItem>): WorkItem {
        // For now, only go one deep. If a tree is needed...well, we'll get to that bridge when we come to it
        // This is left for marking what column each pbi card goes into.
        // Children linking is up to the childid attached to the parent.
        if (pbi.childrenIds && pbi.childrenIds.length) {
            pbi.children = pbi.childrenIds.map((taskId: string) => {
                if (!taskId) { return; }

                // Tasks that do not show up:
                // Removed
                // Tasks from last sprint (Do we want this?)
                return pbiList.find((task: WorkItem) => {
                    return +(task.id) === +taskId;
                });
            }).filter((task: WorkItem) => {
                if (task) { return task; }
            });
        }

        return pbi;
    }

    // TODO: Make this work outside of the sprint comm service
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
        let futureList = this.columns.get(nextColumn).getValue();
        const previousList = this.columns.get(previousColumn).getValue();
        if (previousList) {
            const foundIndex = previousList.findIndex(wi => wi.id === workItem.id);
            if (foundIndex !== -1) {
                previousList.splice(foundIndex, 1);
                this.columns.get(previousColumn).next(previousList);
            }
        }

        futureList.push(workItem);
        // TODO: For some reason this isn't sorting the todo column correctly
        this.sortColumn(futureList);
        this.columns.get(nextColumn).next(futureList);
    }

    private sortColumn(col: Array<WorkItem>) {
        col.sort((a, b) => {
            if (a.backlogPriority > b.backlogPriority) {
                return 1;
            }
            if (a.backlogPriority < b.backlogPriority) {
                return -1;
            }
            if (a.backlogPriority === b.backlogPriority) {
                return 0;
            }
        });
    }
}
