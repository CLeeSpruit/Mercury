export interface ReleaseDefinition {
    id: number;
    name: string;
    description: string;
    createdBy: any; // TODO: User model
    createdOn: Date;
    modifiedBy: any; // TODO: User model
    modifiedOn: Date;
    lastRelease: ReleaseDefinitionRelease;
    path: string;
}

// To avoid a cirular reference, build a short interface
interface ReleaseDefinitionRelease {
    id: number;
    name: string;
    description: string;
}
