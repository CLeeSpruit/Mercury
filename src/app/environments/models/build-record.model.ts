import { BuildIssue } from './build-issue.model';

export interface BuildRecord {
    id: string;
    parentId: string;
    type: string;
    name: string; // Ex: 'Run Jest'
    startTime: Date;
    finishTime: Date;
    currentOperation: any;
    percentComplete: any;
    state: string;
    result: string;
    changeId: number;
    lastModified: Date;
    workerName: string; // Ex: BUILDAGENT2
    order: string;
    details: any;
    errorCount: number;
    warningCount: number;
    url: any;
    log: any;
    task: any;
    issues: Array<BuildIssue>;
}

// TODO: Const of state
// TODO: Const of result
