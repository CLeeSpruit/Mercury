import { Injectable } from '@angular/core';
import { WorkItem } from '../models/work-item';

// TODO: Pretty sure this can be made without injection
@Injectable()
export class WorkItemMapper {
    fields: Map<string, string> = FieldMap;

    createNewTfsPBI = (newPbi: WorkItem, iteration?: string, linkIds?: Array<number>) => {
        // TODO: Have the option to not add this to the current iteration, but the backlog
        // TODO: Also don't hard code this
        iteration = 'OPUS\\Chupacabra\\Sprint 36';
        const allChanges = [];

        if (newPbi.title) {
            allChanges.push(this.buildField(newPbi, 'title'));
        } else {
            // Title is required
            return null;
        }

        if (iteration) {
            allChanges.push(this.buildField(iteration, 'iteration', false));
        }

        if (linkIds) {
            linkIds.forEach((id: number) => {
                allChanges.push({
                    op: 'add',
                    path: '/relations/-',
                    value: {
                        rel: 'System.LinkTypes.Hierarchy-Forward',
                        url: this.buildUrl(id)
                    }
                });
            });
        }
    }

    createNewTfsTask = (newTask: WorkItem, parent: WorkItem) => {
        const allChanges = [];

        if (newTask.title) {
            allChanges.push(this.buildField(newTask, 'title'));
        } else {
            // Title is required
            return null;
        }

        if (parent.iterationPath) {
            allChanges.push(this.buildField(parent, 'iterationPath'));
        }

        allChanges.push({
            op: 'add',
            path: '/relations/-',
            value: {
                rel: 'System.LinkTypes.Hierarchy-Reverse',
                url: this.buildUrl(parent.id)
            }
        });

        return allChanges;
    }

    mapWorkItem = (wi: any) => {
        const mapped = <WorkItem>{
            id: wi.id,
            rev: wi.rev,
            url: wi.url,
            areaPath: wi.fields['System.AreaPath'],
            teamProject: wi.fields['System.TeamProject'],
            iterationPath: wi.fields['System.IterationPath'],
            workItemType: wi.fields['System.WorkItemType'],
            state: wi.fields['System.State'],
            reason: wi.fields['System.Reason'],
            assignedTo: wi.fields['System.AssignedTo'],
            createdDate: new Date(wi.fields['System.CreatedDate']),
            createdBy: wi.fields['System.CreatedBy'],
            changedDate: new Date(wi.fields['System.ChangedDate']),
            changedBy: wi.fields['System.ChangedBy'],
            title: wi.fields['System.Title'],
            remainingWork: wi.fields['Microsoft.VSTS.Scheduling.RemainingWork'],
            backlogPriority: wi.fields['Microsoft.VSTS.Common.BacklogPriority'],
            description: wi.fields['System.Description'],
            effort: wi.fields['Microsoft.VSTS.Scheduling.Effort']
        };

        if (wi.relations) {
            mapped.childrenIds = wi.relations
            .map((relation: any) => {
                if (relation.rel === 'System.LinkTypes.Hierarchy-Forward') {
                    return this.stripUrl(relation.url);
                }
            }).filter((relation: any) => {
                if (relation) { return relation; }
            });
        }

        return mapped;
    }

    private stripUrl(url: string) {
        // Return only the last series of numbers, which is the id
        return url.match(/\d*$/)[0];
    }

    private buildUrl(id: number): string {
        const baseUrl = 'http://tfs2013-mn:8080/tfs/DefaultCollection/_api/_wit/workItems/';
        return baseUrl + id;
    }

    private buildField(value: any, field: string, isProperty = true, operation: string = 'add') {
        return {
            op: operation,
            path: '/fields/' + this.fields.get(field),
            value: isProperty ? value[field] : value
        };
    }
}

const FieldMap = new Map<string, string>(
        [
            ['areaPath', 'System.AreaPath'],
            ['teamProject', 'System.TeamProject'],
            ['iterationPath', 'System.IterationPath'],
            ['workItemType', 'System.WorkItemType'],
            ['workItemType', 'System.WorkItemType'],
            ['state', 'System.State'],
            ['reason', 'System.Reason'],
            ['assignedTo', 'System.AssignedTo'],
            ['createdDate', 'System.CreatedDate'],
            ['createdBy', 'System.CreatedDate'],
            ['changedDate', 'System.ChangedDate'],
            ['changedBy', 'System.ChangedBy'],
            ['title', 'System.Title'],
            ['remainingWork', 'Microsoft.VSTS.Scheduling.RemainingWork'],
            ['backlogPriority', 'Microsoft.VSTS.Common.BacklogPriority'],
            ['description', 'System.Description'],
            ['effort', 'Microsoft.VSTS.Scheduling.Effort']
        ]
    );
