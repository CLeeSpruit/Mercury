import { BuildDefinition } from './build-definition.model';
export interface Build {
    id: number;
    buildNumber: string;
    status: string;
    queueTime: Date;
    startTime: Date;
    finishTime: Date;
    definition: BuildDefinition;
    buildNumberRevision: number;
    project: any; // TODO: Create project model
    uri: string;
    sourceBranch: string; // Ex: refs/heads/itp
    sourceVersion: string; // Ex: guid
    queue: any; // TODO: Maybe make a queue object
    priority: string;
    reason: string;
    requestedFor: any; // TODO: Create user model
    requestedBy: any; // TODO: Create user model
    lastChangedDate: Date;
    lastChangedBy: any; // TODO: Create user model
    parameters: any; // This is a json object so keep as any
    orchestrationPlan: any;
    logs: any;
    repository: any;
    keepForever: boolean;
    retainedByRelease: boolean;
}

// TODO: Const of build status
// completed, inProgress

// TODO: Const of build results
// succeeded

// TODO: Const of priorities
// TODO: Const of reasons
