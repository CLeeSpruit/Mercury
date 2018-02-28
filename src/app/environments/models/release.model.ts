import { ReleaseDefinition } from './release-definition.model';
import { Environment } from './environment.model';
import { Artifact } from './artifact.model';

export interface Release {
    id: number;
    name: string;
    status: string; // TODO: Const of release statuses
    createdOn: Date;
    modifiedOn: Date;
    modifiedBy: any; // TODO: User model
    createdBy: any; // TODO: User model
    environments: Array<Environment>;
    artifact: Artifact;
    variables: any; // json Object
    releaseDefinition: ReleaseDefinition;
    description: string;
    reason: string;
    keepForever: boolean;
    definitionSnapshotRevision: number;
}
