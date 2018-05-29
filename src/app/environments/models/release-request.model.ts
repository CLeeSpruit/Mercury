export interface ReleaseRequest {
    definitionId: number;
    description: string;
    artifacts: Array<ReleaseArtifact>;
    isDraft: boolean;
    manualEnvironments: Array<any>;
}

export interface ReleaseArtifact {
    alias: string;
    instanceReference: ArtifactInstance;
}

export interface ArtifactInstance {
    name: string;
    id: string;
    sourceBranch: string;
    sourceVersion: string;
    sourceRepositoryId: string;
    sourceRepositoryType: string;
}
