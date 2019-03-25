export interface WorkItem {
    id: string;
    rev: number;
    url: string;

    // The rest is set via *.*.* json syntax, so it will need to be properly mapped if pulled from tfs
    // If path isn't specified, assume system.*

    /*** Generic info ***/
    areaPath: string;
    teamProject: string;
    iterationPath: string;
    workItemType: string;
    state: string;
    reason: string;
    assignedTo: string; // TODO: User
    createdDate: Date;
    createdBy: string; // TODO: User
    changedDate: Date;
    changedBy: string; // TODO: User
    title: string;

    /*** Shared ***/
    // VSTS.Common.BacklogPriority
    backlogPriority: number;
    description: string;

    // Relations
    childrenIds: Array<string>;
    children: Array<WorkItem>;

    /*** Tasks ***/
    // VSTS.Scheduling.RemainingWork
    remainingWork: number;

    /*** PBI ***/
    // Microsoft.VSTS.Common.AcceptanceCriteria
    acceptanceCriteria: string;
    boardColumn: string;
    boardColumnDone: boolean;

    // VSTS.Scheduling.Effort
    effort: number;

    /*** Mercury-only properties ***/
    column: string;
}
