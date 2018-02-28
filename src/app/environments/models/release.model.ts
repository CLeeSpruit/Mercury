import { ReleaseDefinition } from './release-definition.model';

export interface Release {
    id: number;
    name: string;
    status: string; // TODO: Const of release statuses
    createdOn: Date;
    modifiedOn: Date;
    modifiedBy: any; // TODO: User model
    createdBy: any; // TODO: User model
    variables: any; // json Object
    releaseDefinition: ReleaseDefinition;
    description: string;
    reason: string;
    keepForever: boolean;
    definitionSnapshotRevision: number;
}
